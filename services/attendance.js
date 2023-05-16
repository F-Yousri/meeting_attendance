const pool = require('../database/pool');
const { logError, logInfo } = require('../logging');
const { insertAttendance, findAttendance, updateAttendance } = require('../database/attendance');

exports.handleAttendance = async (body) => {
  logInfo(body);
  const { type, data } = body;
  const { meetingId, metadata } = data;
  const receivedAt = new Date();

  try {
    if (type === "room.client.joined") {
      await insertAttendance(pool, meetingId, metadata, receivedAt);
      return { message: 'OK' };
    } else if (type === "room.client.left") {
      const attendance = await findAttendance(pool, meetingId, metadata);
      const { joined_at } = attendance;
      const duration = (receivedAt.getTime() - new Date(joined_at).getTime()) / 1000;
      await updateAttendance(pool, meetingId, metadata, receivedAt, duration, joined_at);
      return { message: 'OK' };
    } else {
      const errorMessage = 'Invalid event type';
      logError(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    logError(`${error}`);
    throw error;
  }
};