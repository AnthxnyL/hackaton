import Users from '../models/usersModel.js';
import { hashToken } from '../utils/tokens.js';

export async function authOpaque(req, res, next) {
    try {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ message: 'Missing token' });

        const hashed = hashToken(token);
        const user = await Users.findOne({
        'tokens.hash': hashed,
        'tokens.expiresAt': { $gt: new Date() },
        });

        if (!user) return res.status(401).json({ message: 'Invalid or expired token' });

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}