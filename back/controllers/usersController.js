import usersModel from '../models/usersModel.js'; 

export const getUser = async (req, res) => {
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

export const createUser = async (req, res) => {
    const { email, firstname, lastname, password, address, description, phoneNumber, avatar } = req.body;
    try {
        const newUser = new usersModel({ email, firstname, lastname, password, address, description, phoneNumber, avatar });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req, res) => {
    const { email, firstname, lastname, password, address, description, phoneNumber, avatar } = req.body;
    try {
        const updateUser = await usersModel.findByIdAndUpdate(
            req.params.id,
            { email, firstname, lastname, password, address, description, phoneNumber, avatar },
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
};

export const deleteUser = async (req, res) => {
    try {
        const deleteUser = await usersModel.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};