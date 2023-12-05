const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');


// Controllers
const getAllTours = async (req, res) => {
    try {
      // EXECUTE QUERY
      const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const tours = await features.query;
  
      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
};


const createTour = async(req, res) => {
    try{
            // 1st way
    // const newTours = new Tour({});
    // newTours.save();
    // 2nd way
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {tour: newTour}
    })
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

const getTour = async(req, res) => {
    try{
        const tour = await Tour.findById(req.params.id)
        .select('-__v');
        res.status(200).json({
            status: 'success',
            data: {tour}
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }    
};

const updateTour = async(req, res) => {
    try{
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true,
            runValidators: true})
        .select('-__v');

        res.status(200).json({
            status: 'success',
            data: {updatedTour}
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

const deleteTour = async(req, res) => {
     await Tour.findByIdAndDelete(req.params.id);
    try{
        res.status(200).json({
            status: 'success',
            data: null
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

const getTourStats = async(req, res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group:{
                    // change _id to null to get all tours
                    _id: {$toUpper: '$difficulty'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                    numRatings: {$sum: '$ratingsQuantity'},
                    numTours: {$sum: 1}
                }
            },
            {
                $sort: {avgPrice: 1}
            },
            // {
            //     $match: {_id: {$ne: 'EASY'}}
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {stats}
        });
    
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

const getMonthlyPlan = async(req, res) => {
    try{
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {_id: 0}
            },
            {
                $sort: {numTourStarts: -1}
            },
            {
                $limit: 12
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {plan}
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}





// Export
module.exports = {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan
};