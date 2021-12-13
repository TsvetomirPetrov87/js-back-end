const User = require('../models/User');

async function createUser(username, email, hashedPassword) {
    //приемаме,че сървиса работи само с валидни данни
    const user = new User({
        username,
        email,
        hashedPassword
    })
    await user.save();

    return user; //трябва да го върнем, защото понякога се изисква да редиректнем към логнат потребител
}

async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({username: {$regex: pattern}});

    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');
    const user = await User.findOne({email: {$regex: pattern}});

    return user;
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail
}