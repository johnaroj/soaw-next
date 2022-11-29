import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaClient } from '@prisma/client'
import matchPassword from '@/utils/matchPassword';
import { NEXT_JWT_SECRET } from '@/config/index';

const prisma = new PrismaClient();

export default NextAuth({
    session: {
        jwt: true
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            async authorize(credentials) {
                const { email, password } = credentials;
                if (!email || !password) {
                    throw new Error('Please enter email of password');
                }

                const user = await prisma.users.findFirst({
                    where: {
                        email: email
                    }
                })

                if (!user) {
                    throw new Error('Invalid Email or Password');
                }

                const isPasswordMatched = await matchPassword(password, user.password)
                if (!isPasswordMatched) {
                    throw new Error('Invalid Email or Password')
                }
                return Promise.resolve(user)
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.isAdmin = user.isAdmin
                token.username = user.firstName + ' ' + user.lastName
            }
            return Promise.resolve(token)
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id
                session.user.isAdmin = token.isAdmin
                session.user.name = token.username
            }
            return Promise.resolve(session)
        },
    },
    secret: NEXT_JWT_SECRET,
    jwt: {
        secret: NEXT_JWT_SECRET,
        encryption: true
    },
    pages: {
        signIn: '/login'
    }
})
