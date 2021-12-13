const {Schema, model} = require('mongoose');

const schema = new Schema ({
    name: {type: String, required: true, minLength: 4},
    city: {type: String, required: true, minLength: 3},
    imageUrl: {type: String, required: true, match: [/^https?/, 'Image must be valid URL']},
    freeRooms: {type: Number, required: true, min: 1, max: 100},
    usersBookedRoom: [{type: Schema.Types.ObjectId, ref: 'User'}],
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('Hotel', schema);