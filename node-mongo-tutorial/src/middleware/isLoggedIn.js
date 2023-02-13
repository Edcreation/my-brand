import passport from "passport";

function isLoggedIn(req, res, next) {
    if (req.user) return next();
    res.status(406).json({
        code: 406,
        message: "Log In First",
    })
}
function isLoggedInAsAdmin(req, res, next) {
    const role = req.user.admin
    if (role) {
        return next();
    }
    res.status(401).json({
        code: 401,
        message: "Login as Admin First"
    })
}

export {
    isLoggedIn,
    isLoggedInAsAdmin
}