import { useKeycloak } from "@react-keycloak/ssr";
import { KeycloakInstance } from "keycloak-js";
import { useEffect } from "react";
import { useRouter } from 'next/router';

const LoginPage = () => {
    const { initialized, keycloak } = useKeycloak();
    const router = useRouter();
    const { login = () => { }, authenticated } = keycloak || {};

    useEffect(() => {
        if (!initialized) {
            return;
        }
        if (!authenticated) {
            login();
        }
    }, [login, authenticated, initialized]);

    useEffect(() => {
        if (!initialized) {
            return;
        }

        if (authenticated) {
            router.replace(router.query.redirect);
        }
    })

    return null;
};

export default LoginPage;