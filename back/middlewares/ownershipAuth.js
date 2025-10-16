import { isAdmin } from '../controllers/usersController.js';

export function requireOwnershipOrAdmin(resourceUserIdField = 'userId') {
    return async (req, res, next) => {
        try {
            const user = req.user;
            const resourceUserId = req.body[resourceUserIdField] || req.params.userId;
            
            const userIsAdmin = await isAdmin(user._id);
            
            const isOwner = user._id.toString() === resourceUserId;
            
            if (!isOwner && !userIsAdmin) {
                return res.status(403).json({ message: 'Access denied: not owner or admin' });
            }
            
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };
}