const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Temporary in-memory storage for notifications (replace with database later)
let notifications = [];

// Get all notifications
router.get('/', auth, (req, res) => {
  try {
    // Filter notifications for the current user
    const userNotifications = notifications.filter(
      notification => notification.userId === req.user.id
    );
    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', auth, (req, res) => {
  try {
    const notification = notifications.find(
      n => n.id === req.params.id && n.userId === req.user.id
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, (req, res) => {
  try {
    notifications = notifications.map(notification => {
      if (notification.userId === req.user.id) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to create a notification (for internal use)
const createNotification = (userId, type, title, message, link = null) => {
  const notification = {
    id: Date.now().toString(),
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.push(notification);
  return notification;
};

// Export both the router and the create function
module.exports = {
  router,
  createNotification
}; 