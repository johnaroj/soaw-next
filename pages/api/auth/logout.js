
export default (req, res) => {
    res.redirect(`${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_FRONTEND_URL)}`);
};