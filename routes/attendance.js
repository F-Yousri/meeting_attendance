const express = require('express');
const attendanceController = require('../controllers/attendance');
const router = express.Router();

router.post('/whereby/webhook', attendanceController.handleAttendance);

module.exports = router;