import Users from '../models/usersModel.js';
import bcrypt from 'bcrypt';
import { createOpaqueTokenString, hashToken } from '../utils/tokens.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.debug(`[auth] signIn request for email=${email}`);
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            console.debug(`[auth] signIn: no user for email=${email}`);
            return res.status(401).json({ message: 'No user for this email' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        console.debug(`[auth] signIn: email=${email}, passwordMatches=${passwordMatches}`);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Wrong password' });
        }

    const rawToken = createOpaqueTokenString();
    const tokenHash = hashToken(rawToken);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    user.tokens = user.tokens || [];
    user.tokens.push({ hash: tokenHash, createdAt: new Date(), expiresAt });
    await user.save();

    const safeUser = { ...user.toObject ? user.toObject() : user };
    if (safeUser.password) delete safeUser.password;

    res.json({ message: 'Sign-in successful', user: safeUser, token: rawToken });
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

export const me = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Not authenticated' });

        const safeUser = { ...(user.toObject ? user.toObject() : user) };
        if (safeUser.password) delete safeUser.password;

        res.json(safeUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};