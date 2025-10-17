import User from '../models/usersModel.js';
import Commentaries from '../models/commentariesModel.js';
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
  try {
    const requester = req.user;
    if (!requester) return res.status(401).json({ message: 'Unauthorized' });

    const isAdmin = requester.role === 'admin';

    // Validate role if provided
    if (req.body.role && !['user', 'admin'].includes(req.body.role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Only admins can change the role
    if (req.body.role && !isAdmin) {
      return res.status(403).json({ message: 'Only admins can change roles' });
    }

    // Build update object. Admins may supply any fields (except _id). Non-admins are limited.
    const update = { ...req.body };
    delete update._id; // never allow changing _id

    // Fields that only admins should be able to modify
    const adminOnlyFields = ['tokens', 'role', 'createdAt'];
    if (!isAdmin) {
      adminOnlyFields.forEach((f) => delete update[f]);
    }

    // If password is being updated, hash it
    if (update.password) {
      const saltRounds = 10;
      update.password = await bcrypt.hash(update.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params._id,
      update,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
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
        const deletedCommentsCount = await deleteUserWithComments(req.params._id);
        
        const deleteUser = await User.findByIdAndDelete(req.params._id);
        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ 
            message: 'User deleted successfully', 
            deletedComments: deletedCommentsCount 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteUserWithComments = async (userId) => {
    try {
        const deletedComments = await Commentaries.deleteMany({ userId: userId });
        
        console.log(`Deleted ${deletedComments.deletedCount} comments for user ${userId}`);
        
        return deletedComments.deletedCount;
    } catch (error) {
        console.error('Error deleting user comments:', error);
        throw error;
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