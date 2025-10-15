const usersModel = require('../models/usersModel');

const getUser = async (req, res) => {
  try {
    const user = await usersModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};