
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({

    pickup: {
        type: String,
        required: true,
    },

    destination: {
        type: String,
        required: true,
    },

    distance: {
        type: Number,
        required: true,
    },

    time: {
        type: Number,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    active: {
        type: Boolean,
        default: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
}, {
    timestamps: true,
});

tripSchema.statics.checkDuplicateRoute = async(pickup, destination) => {
    const tripExists = await Trip.findOne({ pickup, destination });

    if (tripExists) {
        throw new Error("Route already exists");
    }

    return true;
};

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;