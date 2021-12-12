const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/user');
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/index');

module.exports = () => (req, res, next) => {
    if(parseToken(req, res)) {
        req.auth = {
            async register(username, password) {
                const token = await register(username, password);
                res.cookie(COOKIE_NAME, token);
            },
            async login() {
                const token = await login(username, password);
                res.cookie(COOKIE_NAME, token);
            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        };
    
        next();
    }
};

async function register(username, password) {
    //TODO adapt parameters to project requirements
    //TODO extra validations
    const existing = await userService.getUserByUsername(username);

    if (existing) {
        throw new Error('Username is taken');
    }
    //ако не съществува го създаваме
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(username, hashedPassword);

    return generateToken(user);
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);

    if (!user) {
        throw new Error('No such user');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect password');
    }

    //ако има match => генерираме токен
    return generateToken(user);

}

//изнасяме генерирането на токен в отделна функция
function generateToken(userData) {
    const token = jwt.sign({
        _id: user._id,
        username: user.username
    }, TOKEN_SECRET);
}

function parseToken(req, res) {
    //ще върне true/false
    const token = req.cookies[COOKIE_NAME];
    if (token) {
        try {
            const userData = jwt.verify(token, TOKEN_SECRET);
            req.user = userData;
            // res.locals.user = userData;
        } catch(err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');
            return false;
        }
    }
    return true;
}
