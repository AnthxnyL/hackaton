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
        const commentaries = await Commentaries.find({ parentId: null })
            .populate('userId', 'firstname lastname avatar email')
            .sort({ createdAt: -1 });
        res.json(commentaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCommentary = async (req, res) => {
     const { description, parentId } = req.body;
    try {
        const user = req.user;
        
        const newCommentary = new Commentaries({ 
            description, 
            userId: user._id, 
            parentId 
        });
        
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

export const getResponses = async (req, res) => {
    try {
        const responses = await Commentaries.find({ parentId: req.params.parentId });
        res.json(responses);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
