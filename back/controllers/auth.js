import Users from '../models/usersModel.js';
import { createOpaqueTokenString, hashToken } from '../utils/tokens.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const rawToken = createOpaqueTokenString();
        const tokenHash = hashToken(rawToken);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

        user.tokens = user.tokens || [];
        user.tokens.push({ hash: tokenHash, createdAt: new Date(), expiresAt });
        await user.save();

        res.json({ message: 'Sign-in successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signUp = async (req, res) => {
    const { email, firstname, lastname, password, address, description, phoneNumber, avatar } = req.body;
    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const newUser = await Users.createUser({ email, firstname, lastname, password, address, description, phoneNumber, avatar });
        res.status(201).json({ message: 'Sign-up successful', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        if (!token) return res.json({ message: 'Sign-out successful' });

        const tokenHash = hashToken(token);
        await Users.updateOne({}, { $pull: { tokens: { hash: tokenHash } } });
        res.json({ message: 'Sign-out successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};