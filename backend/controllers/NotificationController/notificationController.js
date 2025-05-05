const Notification = require('../../models/notificationModel/Notification');

exports.createNotification = async (userId, userType, message, io) => {
    const notification = await Notification.create({ userId, userType, message });
  
    // Emit to the correct user via socket
    io.to(userId.toString()).emit('new_notification', {
      _id: notification._id,
      message,
      createdAt: notification.createdAt,
    });
  
    return notification;
  };
  
  // Get all notifications
  exports.getNotifications = async (req, res) => {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  };
  
  // Mark notification as read
  exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'Notification marked as read' });
  };
  