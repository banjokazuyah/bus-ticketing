const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Trip = require("../models/trip");
const Location = require("../models/location");
const Ticket = require("../models/ticket");

// TRIPS API

router.post("/api/admin/trips/create", auth, async(req, res) => {
    const trip = new Trip({
        ...req.body,
        owner: req.admin._id,
    });

    try {
        const validateLocation = await Location.findLocations(req.body.pickup, req.body.destination);
        const validateRoute = await Trip.checkDuplicateRoute(req.body.pickup, req.body.destination);
        if (validateLocation && validateRoute) {
            await trip.save();
            res.status(200).send({ trip, message: "Trip saved successfully" });
        }
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.post("/api/admin/trips/getTrip", async(req, res) => {
    try {
        const trips = await Trip.findOne({ pickup: req.body.pickup, destination: req.body.destination });
        if (!trips) {
            return res.status(404).send({ status: "error", message: "Route does not exist" });
        }
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        
        const tickets = await Ticket.find({ 
            pickup: req.body.pickup, 
            destination: req.body.destination, 
            status: false, 
            date: { 
                $gte: startOfToday.toISOString(), 
                $lt: endOfToday.toISOString()
            }  
        });
       
        const seatsBooked = tickets.reduce((count, ticket) => {
            return count + parseInt(ticket.seats);
        }, 0)
        res.status(200).send({ status: "Success", data: { trips, seats_booked: seatsBooked } });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.get("/api/admin/trips/getAllTrips", auth, async(req, res) => {
    const match = {};
    // const limit = parseInt(req.query.limit) || 3;
    // const page = req.query.page > 1 ? (parseInt(req.query.page) - 1) * limit : 0; // this is my implementation
    const sort = {};

    if (req.query.active) {
        match.active = req.query.active === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    try {
        const trips = await Trip.find(match);

        res.status(200).send({ status: "Success", data: trips });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.patch("/api/admin/trips/:id", auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["distance", "price", "time", "active"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operation" });
    }
    const _id = req.params.id;
    try {
        const trip = await Trip.findOne({ _id });
        if (!trip) {
            return res.status(404).send({ error: "trip not found" });
        }

        updates.forEach((update) => {
            trip[update] = req.body[update];
        });

        await trip.save();

        res.send(trip);
    } catch (err) {
        res.status(400).send({ error: "Error occurred" });
    }
});

router.delete("/api/admin/trips/:id", auth, async(req, res) => {
    const _id = req.params.id;
    try {
        const trip = await Trip.findOneAndDelete({ _id });
        if (!trip) {
            return res.status(404).send({ status: "Error" });
        }

        res.send({ message: "Deleted Successfully" });
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;