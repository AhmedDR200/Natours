const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name!'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters!'],
        minlength: [10, 'A tour name must have more or equal than 10 characters!'],
        validate: [validator.isAlpha, 'Tour name must only contain characters!']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration!']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size!']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty!'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult!'
        }
    },
    rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0!'],
        max: [5, 'Rating must be below 5.0!']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price!']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price!'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary!']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a cover image!']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    secretTour: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// Virtual properties are properties that are not stored in the database but are calculated using some other value
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});


// doucment middleware: runs before .save() and .create()
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre('save', function(next){
    console.log('Will save document...');
    next();
});



// document middleware: runs after .save() and .create()
tourSchema.post('save', function(doc, next){
    console.log(doc);
    next();
});


// Query middleware (pre) - this keyword points to the current query
tourSchema.pre(/^find/, function(next){
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

// Query middleware (post)
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});


// Aggregation middleware (pre)
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});




const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;