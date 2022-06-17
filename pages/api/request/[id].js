
import prisma from '@/config/db'
import withProtect from '@/utils/withProtect';

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
                    id: Number(req.query.id)
                },
                include: {
                    images: true,
                }
            });
            res.status(200).json(request)
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        } finally {
            await prisma.$disconnect()
        }
    }
    else if (req.method === 'PUT') {
        try {
            const request = await prisma.requests.findUnique({
                where: {
                    id: Number(req.query.id)
                }
            })
            if (request) {
                return res.status(404).json({ success: false, message: 'Request not found' })
            }

            await prisma.images.deleteMany({
                where: {
                    NOT: req.body.images.map(({ id }) => ({ id }))
                },
            });

            req.body.images.map(async image => {
                await prisma.images.upsert({
                    where: { id: image.id || 0 },
                    update: {
                        categories: { connect: { id: Number(image.categoryId) } },
                        requests: { connect: { id: Number(req.query.id) } },
                        type: image.type,
                        base64: image.base64,
                        name: image.name
                    },
                    create: {
                        categories: { connect: { id: Number(image.categoryId) } },
                        requests: { connect: { id: Number(req.query.id) } },
                        type: image.type,
                        base64: image.base64,
                        name: image.name
                    },
                })
            })
            const updatedRequest = await prisma.requests.update({
                where: {
                    id: Number(req.query.id)
                },
                data: {
                    edited,
                    firstName,
                    lastName,
                    address,
                    addressNumber,
                    placeOfBirth,
                    nationality,
                    dateOfBirth: new Date(dateOfBirth),
                    gender,
                    phone: +phone,
                    mobile: +mobile,
                    work: +work,
                    email,
                    identificationNumber,
                    expiryDate: new Date(expiryDate),
                    education,
                    hasCertificate: JSON.parse(hasCertificate),
                    hasPapiamentuOrDutch: JSON.parse(hasPapiamentuOrDutch),
                    gradePapiamentuOrDutch,
                    isFirstTimeRegister: JSON.parse(isFirstTimeRegister),
                    hasReceivedCertificate: JSON.parse(hasReceivedCertificate),
                    candidateNumber,
                    createdBy: req.user.email,
                    updatedBy: req.user.email,
                    user: { connect: { id: +req.user.id } },
                    images: {
                        create: images.map(image => ({
                            category: { connect: { id: image.categoryId } },
                            type: image.type,
                            base64: image.base64,
                            name: image.name
                        }))
                    }
                }
            })

            res.status(200).json(updatedRequest)
        } catch (error) {
            console.log(error.message)
            res.status(404).json({ success: false, message: error.message })
        } finally {
            await prisma.$disconnect();
        }


    }
    else {
        res.setHeader('Allow', ['POST', 'GET'])
        res.status(405).json({ success: false, message: `Method ${req.method} is not allowed` })
    }

}

export default withProtect(handler)