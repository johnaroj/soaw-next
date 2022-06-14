import NextAuth from 'next-auth'
import KeycloakProvider from "next-auth/providers/keycloak";

export default NextAuth({
    providers: [
        KeycloakProvider({
            clientId: 'soaw-next',
            clientSecret: '348b28fb-8f5b-4241-bf86-d7b3c0bf2d24',
            issuer: 'https://request.soaw.cw/auth/realms/soaw',
        })
    ],
    secret: '348b28fb-8f5b-4241-bf86-d7b3c0bf2d24'
})
