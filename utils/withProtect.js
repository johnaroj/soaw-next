import { getSession } from 'next-auth/react'

const withProtect = (handler) => {
    return async (req, res) => {
        const session = await getSession({ req });
        if (!session) {
            res.status(401).json({
                success: false,
                message: 'Please log in to get access'
            })
        } else {
            req.user = session.user;
        }
        return handler(req, res);

    }
}
export default withProtect;