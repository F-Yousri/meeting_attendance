exports.insertAttendance = async (pool, meetingId, userId, joinedAt) => {
    const [result] = await pool.query(`
      INSERT INTO meeting_attendance (meeting_id, user_id, joined_at)
      VALUES (?, ?, ?)
    `, [meetingId, userId, joinedAt]);
    return result;
  };
  
  exports.findAttendance = async (pool, meetingId, userId) => {
    const [[result]] = await pool.query(`
      SELECT * FROM meeting_attendance
      WHERE meeting_id = ? AND user_id = ?
      ORDER BY joined_at DESC
      LIMIT 1
    `, [meetingId, userId]);
    return result;
  };
  
  exports.updateAttendance = async (pool, meetingId, userId, leftAt, duration, joinedAt) => {
    const [result] = await pool.query(`
      UPDATE meeting_attendance
      SET left_at = ?, duration = ?
      WHERE meeting_id = ? AND user_id = ? AND joined_at = ?
    `, [leftAt, duration, meetingId, userId, joinedAt]);
    return result;
  };