const express = require('express');
const bodyParser = require('body-parser');
const attendanceRouter = require('./routes/attendance');
const app = express();
const { logInfo } = require('./logging');

app.use(bodyParser.json());

// health check
app.get('/status', (req, res) => res.status(200).json( { status: "ok" } ))
// attendance calculations
app.use('/whereby', attendanceRouter);


app.listen(3000, () => {
    logInfo('Server listening on port 3000');
});