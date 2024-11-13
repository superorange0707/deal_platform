const User = require('../models/User');

module.exports = {
  getCurrentUser: async (req, res) => {
    try {
      const user_id = req.user.id;
      const user = await User.findByPk(user_id, {
        attributes: ['username', 'fullName']
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user_id = req.user.id;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in changePassword:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}; 