const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const winston = require('winston');

const app = express();
app.use(bodyParser.json());

// Configure the Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post('/whereby/webhook', async (req, res) => {
  const event = req.body.type;
  const meetingId = req.body.data.meetingId;
  const userId = req.body.data.metadata;
  const receivedAt = new Date();

  const requestData = {
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body
  };

  let connection;

  try {
    // Get a database connection from the pool
    connection = await pool.getConnection().catch((err) => {
      const errorMessage = `Database connection error: ${err.message}`;
      logger.error({ error: errorMessage, requestData });
      return Promise.reject(errorMessage);
    });

    if (event === "room.client.joined") {
      // Insert a new attendance record for a user joining a meeting
      await connection.query(`
        INSERT INTO meeting_attendance (meeting_id, user_id, joined_at)
        VALUES (?, ?, ?)
      `, [meetingId, userId, receivedAt]).catch((err) => {
        const errorMessage = `Error executing query: ${err.message}`;
        logger.error({ error: errorMessage, requestData });
        return Promise.reject(errorMessage);
      });

      const responseData = { message: 'OK' };
      logger.info({ requestData, responseData });

      // Send a success response to the client
      res.send(responseData);
    } else if (event === "room.client.left") {
      // Find the most recent attendance record for a user leaving a meeting
      const [[attendance]] = await connection.query(`
        SELECT * FROM meeting_attendance
        WHERE meeting_id = ? AND user_id = ?
        ORDER BY joined_at DESC
        LIMIT 1
      `, [meetingId, userId]).catch((err) => {
        const errorMessage = `Error executing query: ${err.message}`;
        logger.error({ error: errorMessage, requestData });
        return Promise.reject(errorMessage);
      });

      logger.info({ attendance, requestData });

      const joinedAt = attendance.joined_at;
      const duration = (receivedAt.getTime() - new Date(joinedAt).getTime()) / 1000;

      // Update the attendance record with the user's leaving time and duration
      await connection.query(`
        UPDATE meeting_attendance
        SET left_at = ?, duration = ?
        WHERE meeting_id = ? AND user_id = ? AND joined_at = ?
      `, [receivedAt, duration, meetingId, userId, joinedAt]).catch((err) => {
        const errorMessage = `Error executing query: ${err.message}`;
        logger.error({ error: errorMessage, requestData });
        return Promise.reject(errorMessage);
      });

      const responseData = { message: 'OK' };
      logger.info({ requestData, responseData });

      // Send a success response to the client
      res.send(responseData);
    } else {
      // Send an error response for an invalid event type
      const errorMessage = 'Invalid event type';
      logger.error({ error: errorMessage, requestData });
      res.status(400).send({ error: errorMessage });
    }
  } catch (err) {
    // Handle any errors that occur during database queries
    logger.error({ error: `${err}`, requestData });
    res.status(500).send({ error: `${err}` });
  } finally {
    // Release the database connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

app.listen(3000, () => {
  logger.info('Server listening on port 3000');
});