import Commentaries from "../models/commentariesModel.js";
import Users from '../models/usersModel.js';

export const getCommentary = async (req, res) => {
  try {
    const commentary = await Commentaries.findById(req.params.id);
    if (!commentary) {
      return res.status(404).json({ message: 'Commentary not found' });
    }
    res.json(commentary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getCommentaries = async (req, res) => {
    try {
        const commentaries = await Commentaries.find().populate('user', 'firstname lastname email');
        res.json(commentaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCommentary = async (req, res) => {
    const { description, userId } = req.body;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const newCommentary = new Commentaries({ description, user: userId });
        await newCommentary.save();
        res.status(201).json(newCommentary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCommentary = async (req, res) => {
    const { description } = req.body;
    try {
        const updateCommentary = await Commentaries.findByIdAndUpdate(
            req.params.id,
            { description },
            { new: true }
        );
        if (!updateCommentary) {
            return res.status(404).json({ message: 'Commentary not found' });
        }
        res.json(updateCommentary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCommentary = async (req, res) => {
    try {
        const deleteCommentary = await Commentaries.findByIdAndDelete(req.params.id);
        if (!deleteCommentary) {
            return res.status(404).json({ message: 'Commentary not found' });
        }
        res.json({ message: 'Commentary deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};