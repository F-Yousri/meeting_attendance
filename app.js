const express = require('express');
const bodyParser = require('body-parser');
const attendanceRouter = require('./routes/attendance');
const app = express();
const { logInfo } = require('./logging');

app.use(bodyParser.json());

app.use('/attendance', attendanceRouter);

app.listen(3000, () => {
    logInfo('Server listening on port 3000');
});