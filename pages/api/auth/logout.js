
const handler = (req, res) => {
    res.redirect(`${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/soaw/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_FRONTEND_URL)}`);
};

export default handler;