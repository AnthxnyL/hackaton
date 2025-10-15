import mongoose from 'mongoose';
import User from './usersModel.js';

const commentariesSchema = new mongoose.Schema({
    description: String,
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Commentaries = mongoose.model('Commentaries', commentariesSchema);

export default Commentaries;