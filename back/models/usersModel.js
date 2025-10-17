import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: String,
    address: String,
    description: String,
    phoneNumber: String,
    createdAt: { type: Date, default: Date.now },
    tokens: [
        {
            hash: String,
            createdAt: Date,
            expiresAt: Date
        }
    ],
});

userSchema.pre('findOneAndDelete', async function(next) {
    try {
        const userId = this.getQuery()._id;
        
        const { default: Commentaries } = await import('./commentariesModel.js');
        
        await Commentaries.deleteMany({ userId: userId });
        
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;