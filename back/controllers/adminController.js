import Users from '../models/usersModel.js';
import Commentaries from '../models/commentariesModel.js';

export const getNumberOfUsers = async(req, res) => {
    try {
        const users = await Users.countDocuments();
        res.json(users)
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
}

export const getNumberOfAdresses = async(req, res) => {
    try {
       const address = await Users.countDocuments({
            address: { $nin: [null, ""] }
        });
        res.json(address)
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error'})
    }
}

export const newUsersThisMonth = async(req, res) => {
    try {
        const usersThisMonth = await Users.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });
        res.json(usersThisMonth)
    }catch(error){
        console.error(error)
        res.status(500).json({ message: 'Server error'})
    }
}

export const totalComments = async(req, res) => {
    try {
        const totalComments = await Commentaries.countDocuments();
        res.json(totalComments);
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error'})
    }
}

export const commentsPerDay = async(req, res) => {
    try {
        const nbComments = await Commentaries.aggregate([{
            $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
        },
        {
            $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
            }
        }]);
        res.json(nbComments)
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error'})
    }
}

