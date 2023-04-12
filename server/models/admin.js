
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Ticket = require("./trip");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid email address");
            }
        },
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain \"password\"");
            }
        },
    },

    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }],
/*
    avatar: {
        type: Buffer
    } */
}, {
    timestamps: true,
});

adminSchema.virtual("locations", {
    ref: "Location",
    localField: "_id",
    foreignField: "owner",
});

adminSchema.virtual("trips", {
    ref: "Trip",
    localField: "_id",
    foreignField: "owner",
});

adminSchema.methods.generateAuthToken = async function() {
    const expiresIn = 3600;
    const admin = this;
    const token = jwt.sign({ _id: admin._id.toString() }, process.env.TOKEN_SECRET_KEY, { expiresIn });

    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return token;
};

adminSchema.methods.toJSON = function() {
    const admin = this;
    const adminObject = admin.toObject();

    delete adminObject.password;
    delete adminObject.tokens;
    delete adminObject.__v;
    delete adminObject.avatar;
    return adminObject;
};

adminSchema.statics.findByCredentials = async(email, password) => {
    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new Error("Incorrect username or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        throw new Error("Incorrect username or password");
    }

    return admin;
};

adminSchema.pre("save", async function(next) {
    const admin = this;

    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }

    next();
});

adminSchema.pre("remove", async function(next) {
    const admin = this;
    await Ticket.deleteMany({ owner: admin._id });
    next();
});
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;