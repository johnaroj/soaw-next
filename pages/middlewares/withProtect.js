

const withProtect = (handler) => {
    return async (req, res) => {

        console.log(req);

        return handler(req, res);

    }
}
export default withProtect;