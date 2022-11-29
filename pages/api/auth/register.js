import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { firstName, lastName, email, password } = req.body
            const userExists = await prisma.users.findFirst({
                where: { email: email }
            })

            if (userExists) {
                res.status(400).send({ success: false, message: 'User already exists' })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)

                const user = await prisma.users.create({
                    data: { firstName: firstName, lastName: lastName, email: email, password: hashedPassword }
                })

                if (user) {
                    res.status(200).json({
                        success: true,
                        message: 'Account Registered successfully'
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        message: 'Invalid email or password'
                    })
                }
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error.message
            })
        } finally {
            prisma.$disconnect();
        }


    } else {
        res.status(403).json({ message: 'Method not allowed' });
    }
}
export default handler;