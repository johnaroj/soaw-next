import jwt from "jsonwebtoken";
import { parseCookies } from "./cookies";
import { useKeycloak } from '@react-keycloak/ssr';

export const KEYCLOAK_CONFIG = {
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
};

export function isTokenExpired(token) {
    const payload = getPayload(token);

    const clockTimestamp = Math.floor(Date.now() / 1000);

    return clockTimestamp > payload.exp;
}

export function getPayload(token) {
    return JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString("utf8")
    );
}

export function authorizedFunction(roles) {
    const { keycloak } = useKeycloak();

    const isAuthorized = () => {
        if (keycloak && keycloak.authenticated && roles) {
            return roles.some(r => {
                const realm = keycloak?.hasRealmRole(r);
                const resource = keycloak?.hasResourceRole(r);
                return realm || resource;
            })
        }
        return false;
    }
    return isAuthorized();
}

export function validateAuth(req) {
    const cookies = parseCookies(req);
    if (!cookies.kcToken) {
        return false;
    }
    const token = Buffer.from(cookies.kcToken, "base64").toString("utf8");
    const payloadOrFalse = verifyToken(token, process.env.JWT_SECRET);
    return payloadOrFalse
        ? ({ token, payload })
        : payloadOrFalse;
}
//verificação completa
export function verifyToken(token, key) {
    try {
        return jwt.verify(token, key, { ignoreExpiration: false });
    } catch (e) {
        console.error(e, token, key);
        return false;
    }
}