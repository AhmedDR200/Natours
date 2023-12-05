const express = require('express');
const {getAllTours,
       createTour,
       getTour,
       updateTour,
       deleteTour,
       getTourStats,
       getMonthlyPlan} = require('../controllers/tourControllers'
);

const router = express.Router();

// Param Middleware
router.param('id', (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    next();
});

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

// Check if id is valid
// If not, send back 404 (not found)
// Add it to the get handler stack




router.route('/')
.get(getAllTours)
.post(createTour);

router.route('/tour-stats')
.get(getTourStats);

router.route('/monthly-plan/:year')
.get(getMonthlyPlan);

router.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);


module.exports = router;