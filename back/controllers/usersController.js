import User from '../models/usersModel.js';
import bcrypt from 'bcrypt';

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req, res) => {
  const { email, firstname, lastname, password, address, description, phoneNumber, avatar } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ email, firstname, lastname, password: hashed, address, description, phoneNumber, avatar });
    await newUser.save();

    const { password: _pw, ...userSafe } = newUser.toObject();
    res.status(201).json({ success: true, user: userSafe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateUser = async (req, res) => {
    const { email, firstname, lastname, password, role, address, description, phoneNumber, avatar } = req.body;
    if (role && !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params._id,
            { email, firstname, lastname, password, role, address, description, phoneNumber, avatar },
            { new: true }
        );
        if (!updateUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updateUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteUser = async (req, res) => {
    const checkAdmin = await isAdmin(req.params._id)
    if (checkAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    try {
        const deleteUser = await User.findByIdAndDelete(req.params._id);
        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const isAdmin = async (id) => {
  try {
    const user = await User.findById(id);
    if (user && user.role === 'admin') {
      return true;
    }
    return false;
  } catch(error){
    console.error(error);
    return false;
  }
}