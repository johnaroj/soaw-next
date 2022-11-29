
import prisma from '@/config/db'
import withProtect from '@/utils/withProtect';


const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            if(req.query.updated){
                return res.status(200).json(false)
            }
            const request = await prisma.requests.findFirst({
                where: {
                    identificationNumber: req.query.identificationNumber,
                    type:req.query.type,
                },
            });
            return res.status(200).json(!!request.id)
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