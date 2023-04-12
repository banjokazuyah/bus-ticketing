
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        unique: true,
    },

    shortcode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator(v) {
                return v.length === 3;
            },
            message: "Shortcode must be exactly 3 characters long.",
        },
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
}, {
    timestamps: true,
});

locationSchema.statics.findLocations = async(pickup, destination) => {
    const pickupExists = await Location.findOne({ location: pickup });

    if (!pickupExists) {
        throw new Error("Pickup location is not allowed");
    }

    const destinationExists = await Location.findOne({ location: destination });

    if (!destinationExists) {
        throw new Error("Destination location is not allowed");
    }

    return true;
};

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;