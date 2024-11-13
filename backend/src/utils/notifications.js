const Notification = require('../models/notification');

const createNotification = async (userId, type, title, message, link = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      link
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification
}; 