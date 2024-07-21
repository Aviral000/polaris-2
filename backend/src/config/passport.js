const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Token_Key } = require("../config/config");
const { findUserById } = require("../services/user.service");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Token_Key.Private_key
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
    try {
        const user = await findUserById({ id: payload._id });

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});

module.exports = (passport) => {
    passport.use(jwtStrategy);
};