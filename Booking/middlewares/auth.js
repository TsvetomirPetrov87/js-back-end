const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/user');
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/index');

module.exports = () => (req, res, next) => {
    if(parseToken(req, res)) {
        req.auth = {
            async register(username, email, password) {
                const token = await register(username, email, password);
                res.cookie(COOKIE_NAME, token);
                res.send('HELLO REGISTER');
            },
            async login() {
                const token = await login(username, password);
                res.cookie(COOKIE_NAME, token);
                res.send('HELLO LOGIN');
            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        };
    
        next();
    }
};

async function register(username, email, password) {
    //TODO adapt parameters to project requirements
    //TODO extra validations
    const existUsername = await userService.getUserByUsername(username);
    const existEmail = await userService.getUserByEmail(email);

    if (existUsername) {
        throw new Error('Username is taken');
    } else if (existEmail) {
        throw new Error('Email is taken');
    }

    //ако не съществува го създаваме
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(username, email, hashedPassword);

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
        username: user.username,
        email: user.email
    }, TOKEN_SECRET);
}

function parseToken(req, res) {
    //ще върне true/false
    const token = req.cookies[COOKIE_NAME];
    if (token) {
        try {
            const userData = jwt.verify(token, TOKEN_SECRET);
            req.user = userData;
            res.locals.user = userData;
        } catch(err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');
            return false;
        }
    }
    return true;
}
