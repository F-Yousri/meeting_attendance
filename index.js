const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());

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
      
  const connection = await pool.getConnection().catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    throw new Error(err);
  });

  if(event === "room.client.joined") {
    try {
      await connection.query(`
        INSERT INTO meeting_attendance (meeting_id, user_id, joined_at)
        VALUES (?, ?, ?)
      `, [meetingId, userId, receivedAt]);
  
      res.send('OK');
    } finally {
      connection.release();
    }
  } else if (event === "room.client.left") {
    const [[attendance]] = await connection.query(`
      SELECT * FROM meeting_attendance
      WHERE meeting_id = ? AND user_id = ?
      ORDER BY joined_at DESC
      LIMIT 1
    `, [meetingId, userId]);

    const joinedAt = attendance.joined_at;
    const duration = (receivedAt.getTime() - new Date(joinedAt).getTime()) / 1000;

    try {
      await connection.query(`
        UPDATE meeting_attendance
        SET left_at = ?, duration = ?
        WHERE meeting_id = ? AND user_id = ? AND joined_at = ?
      `, [receivedAt, duration, meetingId, userId, joinedAt]);

      res.send('OK');
    } finally {
      connection.release();
    }
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});