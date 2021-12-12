const {Schema, model} = require('mongoose');

const schema = new Schema ({
    name: {type: String, required: true, unique: true},
    city: {type: String, required: true},
    imageUrl: {type: String, required: true},
    freeRooms: {type: Number, required: true, min: 1, max: 100},
    usersBookedRoom: [{type: String, required: true}],
    owner: [{type: String, required: true}]
})