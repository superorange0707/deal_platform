const { createNotification } = require('../utils/notifications');

// In your create deal route
router.post('/', auth, async (req, res) => {
  try {
    const deal = await Deal.create({ ...req.body, userId: req.user.id });
    
    // Create notification for admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        'new_order',
        'New Deal Created',
        `A new deal "${deal.title}" requires your approval`,
        `/deals/${deal._id}`
      );
    }
    
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); 