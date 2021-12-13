const {Schema, model} = require('mongoose');

const schema = new Schema ({
    username: {type: String, required: true},
    email: {type: String, required: true},
    hashedPassword: {type: String, required: true}
})

module.exports = model('User', schema);

// email: {type: String, required: true},
// username: {type: String, required: true},
// password: {type: String, required: true},
// bookedHotels: [{type: String, required: true}],
// offeredHotels: [{type: String, required: true}],
// hashedPassword: {type: String, required: true}