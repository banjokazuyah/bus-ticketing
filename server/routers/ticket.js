const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Ticket = require("../models/ticket");
const Location = require("../models/location");
const { sendTicketInfo } = require("../emails/nodemailer");

// Tickets API

router.post("/api/admin/tickets/create", async(req, res) => {
    const ticket = new Ticket({
        ...req.body,
    });

    try {
        const validateLocation = await Location.findLocations(req.body.pickup, req.body.destination);
        if (validateLocation) {
            await ticket.save();
            sendTicketInfo(ticket);
            res.status(200).send({ ticket, message: "Ticket created successfully" });
        }
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.get("/api/admin/tickets/getAllTickets", auth, async(req, res) => {
    const match = {};
    // const limit = parseInt(req.query.limit) || 20;
    // const page = req.query.page > 1 ? (parseInt(req.query.page) - 1) * limit : 0; // this is my implementation
    const sort = {};

    if (req.query.status) {
        match.status = req.query.status === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        if (parts[0] === "date") {
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        } else {
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        }
    } else {
        sort.date = -1; // add this line to sort by createdAt field by default
    }
    try {
        const tickets = await Ticket.find(match).sort(sort);

        res.status(200).send({ status: "Success", data: tickets });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.patch("/api/admin/tickets/:id", auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["status", "cust_email"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operation", message: "Update is not permitted" });
    }
    const id = req.params.id;
    try {
        const ticket = await Ticket.findOne({ ticket_id: id });
        if (!ticket) {
            return res.status(404).send({ error: "ticket not found" });
        }

        updates.forEach((update) => {
            ticket[update] = req.body[update];
        });

        await ticket.save();

        res.send(ticket);
    } catch (err) {
        res.status(400).send({ error: "Error occurred", message: err.message });
    }
});

module.exports = router;