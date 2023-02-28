import passport from "passport";


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
function isLoggedIn(req, res, next) {
    const role = req.user
    if (role) {
        return next();
    }
    res.status(401).json({
        code: 401,
        message: "Login as First"
    })
}

export {
    isLoggedInAsAdmin
}