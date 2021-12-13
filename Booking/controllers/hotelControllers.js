const { isUser } = require('../middlewares/guards');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('hotel/create');
});

router.post('/create', isUser(), async (req, res) => {
    const hotelData = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        freeRooms: req.body.imageUrl,
        usersBookedRoom: [],
        owner: req.user._id
    };
try {
  await req.storage.createHotel(hotelData);

  res.redirect('/');
} catch(err) {
    console.log(err);

    let errors;
    if(err.errors) {
        errors = Object.values(err.errors).map(e => e.properties.message);
    } else {
        errors = [err.message];
    }
   
    const ctx = {
        errors: [err.message],
        hotelData: {
            name: req.body.name,
            city: req.body.city,
            imageUrl: req.body.imageUrl,
            freeRooms: req.body.freeRooms
        }
    };

    res.render('hotel/create', ctx)
}
   
});

module.exports = router;