const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Location = require("../models/location");

// LOCATION API
router.post("/api/admin/locations", auth, async(req, res) => {
    const location = new Location({
        ...req.body,
        owner: req.admin._id,
    });
    try {
        await location.save();
        res.status(200).send({ location, message: "Location saved successfully" });
    } catch (error) {
        if (error?.code === 11000) {
            res.status(400).send({
                status: "error",
                message: "Location/Shortcode already exists",
            });
        } else if (error?.name === "ValidationError") {
            if (error?.errors?.password?.kind === "minlength") {
                res.status(400).send({
                    status: "error",
                    message: "Shortcode should be exactly 3 characters long",
                });
            } else {
                res.status(400).send({ message: error?.message });
            }
        } else {
            res.status(400).send({
                status: "error",
                message: error.message,
            } || "Error occurred");
        }
    }
});

router.get("/api/admin/locations", async(req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).send({ status: "Success", data: locations });
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.patch("/api/admin/locations/:id", auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["location", "shortcode"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operation" });
    }
    const _id = req.params.id;
    try {
        const location = await Location.findOne({ _id, owner: req.admin._id });
        if (!location) {
            return res.status(404).send({ error: "location not found" });
        }

        updates.forEach((update) => {
            location[update] = req.body[update];
        });

        await location.save();

        res.send(location);
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.delete("/api/admin/locations/:id", auth, async(req, res) => {
    const _id = req.params.id;
    try {
        const location = await Location.findOneAndDelete({ _id });
        if (!location) {
            return res.status(404).send({ status: "Error" });
        }

        res.send({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

module.exports = router;