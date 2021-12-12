const User = require('../models/User');

async function createUser(username, hashedPassword) {
    //приемаме,че сървиса работи само с валидни данни
    const user = new User({
        username,
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

module.exports = {
    createUser,
    getUserByUsername
}