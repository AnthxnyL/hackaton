import { verifySignedToken } from '../utils/tokens.js';

export function authSigned(secret) {
    return (req, res, next) => {
        try {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ message: 'Missing token' });
        const payload = verifySignedToken(token, secret);
        req.userId = payload.sub;
        req.tokenPayload = payload;
        next();
        } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
}