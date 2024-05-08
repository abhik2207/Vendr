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
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzE1MGIzOTNhNWE3NjBjNzY4NmZmOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE0OTEyNDYzfQ.ZLlPlFtPyTWLHLF7-NpDi049ZN56vrD7vX-vfKbqbLU";
    return token;
};