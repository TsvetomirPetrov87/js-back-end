const router = require('express').Router(); //factory function
const {body, validationResult} = require('express-validator');
const {isGuest} = require('../middlewares/guards');

router.get('/register', (req, res) => {
    res.render('user/register');
})

router.post(
    //валидация express-validator или с 'if'
    '/register',  
    body('username').isLength({ min: 3}).withMessage('Username must be at least 3 characters long'), //TODO according requirements
    body('rePass').custom((value, {req}) => {
        if(value != req.body.password) {
            throw new Error('Passwords don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            if(errors.isLength > 0) {
                //TODO improve error messages
                throw new Error('Validation error');
            }

            await req.auth.register(req.body.username, req.body.password);

            res.redirect('/')  //TODO change redirect location
        } catch(err) {
            const ctx = {
                errors,
                userData: {
                    username: req.body.username
                }
            }
            res.render('user/register', ctx);
        }
    }
)

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/login', async (req, res) => {
    //валидационни проверки нямаме
    try {
        await req.auth.login(req.body.username, req.body.password);
    } catch(err) {
        const ctx = {
            errors: [err.message],
            userData: {
                username: req.body.username
            }
        }
    }
    
    res.render('user/login', ctx);
})

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
})

module.exports = router;