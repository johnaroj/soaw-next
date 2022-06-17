const admin = (handler) => {
    return async (req, res) => {
        if (req.user && req.user.isAdmin) {
            return handler(req, res);
        } else {
            res.status(403).json({
                success: false, message: 'You do not have permission to perform this action'
            })
        }
    }
}


export { admin }