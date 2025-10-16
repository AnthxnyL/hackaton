import mongoose from 'mongoose';
import User from './usersModel.js';

const commentarySchema = new mongoose.Schema({
    description: String,
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commentary', default: null}
});

const Commentary = mongoose.model('Commentary', commentarySchema);

export default Commentary;