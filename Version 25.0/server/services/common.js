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
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzE2NzA4ZmY1MmI1ZDJjNDYzN2EyMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNDUxMzc5M30.14phlXz8tSJK5b-SvGkR98Z7Wibn-av0f0CLxupfJ9w";
    return token;
};