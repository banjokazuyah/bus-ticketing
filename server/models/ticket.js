
const mongoose = require("mongoose");
const validator = require("validator");

const ticketSchema = new mongoose.Schema({

    cust_email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid email address");
            }
        },
    },

    pickup: {
        type: String,
        required: true,
    },

    destination: {
        type: String,
        required: true,
    },

    total_amount: {
        type: Number,
        required: true,
    },

    seats: {
        type: Number,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },

    ticket_id: {
        type: Number,
        unique: true,
    },

    stars: {
        type: Number,
        default: 0,
    },

    status: {
        type: Boolean,
        default: false,
    },

    cust_name: {
        type: String,
        default: "Anonymous Customer"
    }

}, {
    timestamps: true,
});

// Create a ticket counter to generate unique ticket IDs
const counterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        default: 0,
    },
});

// Define a method to increment the counter value and save the updated value
counterSchema.statics.getNextValue = async function(id) {
    const counter = await this.findOneAndUpdate({ id }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return counter.value;
};

// Create a Mongoose model for the ticket counter
const Counter = mongoose.model("Counter", counterSchema);

async function generateTicketId(ticket) {
    ticket.ticket_id = await Counter.getNextValue("ticket_id");
}

// Add a pre-save hook to the ticket schema to generate a unique ticket ID before saving
ticketSchema.pre("save", async function(next) {
    const ticket = this;
    if (!ticket.ticket_id) {
        await generateTicketId(ticket);
    }
    next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;