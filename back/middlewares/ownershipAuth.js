export function requireOwnershipOrAdmin(resourceUserIdField = 'userId') {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).json({ message: 'Unauthorized' });

            const userIsAdmin = (user.role === 'admin');

            let resourceUserId = req.body?.[resourceUserIdField] || req.params?.[resourceUserIdField];

            if (!resourceUserId) {
                const candidateId = req.params?.id || req.params?._id || req.params?.parentId || req.params?.userId;
                if (candidateId) {
                    try {
                        const { default: Commentaries } = await import('../models/commentariesModel.js');
                        const resource = await Commentaries.findById(candidateId).select('userId').lean();
                        if (resource && resource.userId) resourceUserId = String(resource.userId);
                    } catch (e) {
                        console.error('Ownership lookup failed:', e);
                    }
                }
            }

            if (!resourceUserId) {
                if (!userIsAdmin) return res.status(403).json({ message: 'Access denied: not owner or admin' });
                return next();
            }

            const isOwner = String(user._id) === String(resourceUserId);

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