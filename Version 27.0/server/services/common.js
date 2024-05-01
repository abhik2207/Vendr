const passport = require("passport")

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
}

exports.sanitizeUser = (user) => {
    return {
        id: user.id,
        role: user.role
    }
}

exports.cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzE1MGIzOTNhNWE3NjBjNzY4NmZmOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE0NTU4Njc1fQ.pXAznbt9AV1XSw3h-CONIp16Z8t5xWl9rbo6NNPXJ8c";
    return token;
};