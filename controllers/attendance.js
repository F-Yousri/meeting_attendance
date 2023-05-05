const attendanceService = require('../services/attendance');

exports.handleAttendance = async (req, res) => {
  try {
    const result = await attendanceService.handleAttendance(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
};