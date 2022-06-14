
import prisma from '@/config/db'
import withProtect from 'middlewares/withProtect';
import isEmpty from "lodash/isEmpty";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const request = await prisma.requests.findUnique({
                where: {
                    registeredAddress: {
                        startsWith: req.query.street
                    }
                },
            });
            res.status(200).json(request)
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        } finally {
            await prisma.$disconnect()
        }
    }
    else {
        res.setHeader('Allow', ['GET'])
        res.status(405).json({ success: false, message: `Method ${req.method} is not allowed` })
    }

}

export default withProtect(handler)