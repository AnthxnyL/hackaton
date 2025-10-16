export function requireRole(allowedRoles) {
    return (req, res, next) => {
        try {
            const user = req.user;
            
            if (!user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };
}
