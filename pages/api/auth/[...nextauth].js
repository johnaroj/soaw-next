import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import jwt_decode from "jwt-decode";

const adminCheck = (accessToken) => {
    const access_token = jwt_decode(accessToken);
    if (!access_token) { return false; }
    return access_token.realm_access.roles.includes('SoawAdmin');
}

const refreshAccessToken = async (token) => {
    try {
        if (Date.now() > token.refreshTokenExpired) throw Error;
        const details = {
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: ['refresh_token'],
            refresh_token: token.refreshToken,
        };
        const formBody = [];
        Object.entries(details).forEach(([key, value]) => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(value);
            formBody.push(encodedKey + '=' + encodedValue);
        });
        const formData = formBody.join('&');
        const url = `${process.env.KEYCLOAK_BASE_URL}/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formData,
        });
        const refreshedTokens = await response.json();
        if (!response.ok) throw refreshedTokens;
        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpired: Date.now() + (refreshedTokens.expires_in - 15) * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            refreshTokenExpired:
                Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
        };
    } catch (error) {
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
};

export default NextAuth({
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: "https://request.soaw.cw/auth/realms/SOAW",
            "authorization_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/auth",
            "token_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/token",
            "introspection_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/token/introspect",
            "userinfo_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/userinfo",
            "end_session_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/logout",
            "jwks_uri": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/certs",
            "check_session_iframe": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/login-status-iframe.html",
            "grant_types_supported": [
                "authorization_code",
                "implicit",
                "refresh_token",
                "password",
                "client_credentials",
                "urn:ietf:params:oauth:grant-type:device_code",
                "urn:openid:params:grant-type:ciba"
            ],
            "response_types_supported": [
                "code",
                "none",
                "id_token",
                "token",
                "id_token token",
                "code id_token",
                "code token",
                "code id_token token"
            ],
            "subject_types_supported": [
                "public",
                "pairwise"
            ],
            "id_token_signing_alg_values_supported": [
                "PS384",
                "ES384",
                "RS384",
                "HS256",
                "HS512",
                "ES256",
                "RS256",
                "HS384",
                "ES512",
                "PS256",
                "PS512",
                "RS512"
            ],
            "id_token_encryption_alg_values_supported": [
                "RSA-OAEP",
                "RSA-OAEP-256",
                "RSA1_5"
            ],
            "id_token_encryption_enc_values_supported": [
                "A256GCM",
                "A192GCM",
                "A128GCM",
                "A128CBC-HS256",
                "A192CBC-HS384",
                "A256CBC-HS512"
            ],
            "userinfo_signing_alg_values_supported": [
                "PS384",
                "ES384",
                "RS384",
                "HS256",
                "HS512",
                "ES256",
                "RS256",
                "HS384",
                "ES512",
                "PS256",
                "PS512",
                "RS512",
                "none"
            ],
            "request_object_signing_alg_values_supported": [
                "PS384",
                "ES384",
                "RS384",
                "HS256",
                "HS512",
                "ES256",
                "RS256",
                "HS384",
                "ES512",
                "PS256",
                "PS512",
                "RS512",
                "none"
            ],
            "response_modes_supported": [
                "query",
                "fragment",
                "form_post"
            ],
            "registration_endpoint": "https://request.soaw.cw/auth/realms/SOAW/clients-registrations/openid-connect",
            "token_endpoint_auth_methods_supported": [
                "private_key_jwt",
                "client_secret_basic",
                "client_secret_post",
                "tls_client_auth",
                "client_secret_jwt"
            ],
            "token_endpoint_auth_signing_alg_values_supported": [
                "PS384",
                "ES384",
                "RS384",
                "HS256",
                "HS512",
                "ES256",
                "RS256",
                "HS384",
                "ES512",
                "PS256",
                "PS512",
                "RS512"
            ],
            "introspection_endpoint_auth_methods_supported": [
                "private_key_jwt",
                "client_secret_basic",
                "client_secret_post",
                "tls_client_auth",
                "client_secret_jwt"
            ],
            "introspection_endpoint_auth_signing_alg_values_supported": [
                "PS384",
                "ES384",
                "RS384",
                "HS256",
                "HS512",
                "ES256",
                "RS256",
                "HS384",
                "ES512",
                "PS256",
                "PS512",
                "RS512"
            ],
            "claims_supported": [
                "aud",
                "sub",
                "iss",
                "auth_time",
                "name",
                "given_name",
                "family_name",
                "preferred_username",
                "email",
                "acr"
            ],
            "claim_types_supported": [
                "normal"
            ],
            "claims_parameter_supported": true,
            "scopes_supported": [
                "openid",
                "offline_access",
                "address",
                "microprofile-jwt",
                "phone",
                "profile",
                "email",
                "roles",
                "role_list",
                "web-origins"
            ],
            "request_parameter_supported": true,
            "request_uri_parameter_supported": true,
            "require_request_uri_registration": true,
            "code_challenge_methods_supported": [
                "plain",
                "S256"
            ],
            "tls_client_certificate_bound_access_tokens": true,
            "revocation_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/revoke",
            "revocation_endpoint_auth_methods_supported": [
                "private_key_jwt",
                "client_secret_basic",
                "client_secret_post",
                "tls_client_auth",
                "client_secret_jwt"
            ],
            "revocation_endpoint_auth_signing_alg_values_supported": [
                "PS384",
                "ES384",
                "RS384",
                "HS256",
                "HS512",
                "ES256",
                "RS256",
                "HS384",
                "ES512",
                "PS256",
                "PS512",
                "RS512"
            ],
            "backchannel_logout_supported": true,
            "backchannel_logout_session_supported": true,
            "device_authorization_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/auth/device",
            "backchannel_token_delivery_modes_supported": [
                "poll"
            ],
            "backchannel_authentication_endpoint": "https://request.soaw.cw/auth/realms/SOAW/protocol/openid-connect/ext/ciba/auth"
        })
    ],
    secret: process.env.SECRET,
    callbacks: {
        /**
         * @param  {object} user     User object
         * @param  {object} account  Provider account
         * @param  {object} profile  Provider profile
         * @return {boolean|string}  Return `true` to allow sign in
         *                           Return `false` to deny access
         *                           Return `string` to redirect to (eg.: "/unauthorized")
         */
        async signIn({ user, account }) {
            if (account && user) {
                return true;
            } else {
                // TODO : Add unauthorized page
                return '/unauthorized';
            }
        },
        /**
         * @param  {string} url      URL provided as callback URL by the client
         * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
         * @return {string}          URL the client will be redirect to
         */
        async redirect({ url, baseUrl }) {
            return String(url).startsWith(baseUrl) ? url : baseUrl;
        },
        /**
         * @param  {object} session      Session object
         * @param  {object} token        User object    (if using database sessions)
         *                               JSON Web Token (if not using database sessions)
         * @return {object}              Session that will be returned to the client
         */
        async session({ session, token }) {
            if (token) {
                session.user = token.user;
                session.user.isAdmin = adminCheck(token.accessToken);
                session.error = token.error;
                session.accessToken = token.accessToken;
            }
            return session;
        },
        /**
         * @param  {object}  token     Decrypted JSON Web Token
         * @param  {object}  user      User object      (only available on sign in)
         * @param  {object}  account   Provider account (only available on sign in)
         * @param  {object}  profile   Provider profile (only available on sign in)
         * @param  {boolean} isNewUser True if new user (only available on sign in)
         * @return {object}            JSON Web Token that will be saved
         */
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                // Add access_token, refresh_token and expirations to the token right after signin
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpired =
                    Date.now() + (account.expires_in - 15) * 1000;
                token.refreshTokenExpired =
                    Date.now() + (account.refresh_expires_in - 15) * 1000;
                token.user = user;
                return token;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpired) return token;

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
    },
});
