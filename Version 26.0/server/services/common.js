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
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzE3N2U5N2Y3NTliYzliZmNkMTM4YyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE0NTE4MDk5fQ.lT2ZlNRnTcHNCcuOrVNolp02YvEs07_prCQiEtL1En4";
    return token;
};