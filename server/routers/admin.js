const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Admin = require("../models/admin");
const auth = require("../middleware/auth");
const router = new express.Router();

// POST /admin

router.post("/api/admin/create", async(req, res) => {
    const admin = new Admin(req.body);
    try {
        await admin.save();
        res.status(200).send({ admin });
    } catch (error) {
        if (error?.code === 11000) {
            res.status(400).send({
                status: "error",
                message: "Email already exists",
            });
        } else if (error?.name === "ValidationError") {
            if (error?.errors?.password?.kind === "minlength") {
                res.status(400).send({
                    status: "error",
                    message: "Password should be minimum 7 characters long",
                });
            } else {
                res.status(400).send({ message: error?.message });
            }
        } else {
            res.status(400).send({
                status: "error",
                message: error,
            } || "Error occurred");
        }
    }
});

router.post("/api/admin/login", async(req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password);
        const token = await admin.generateAuthToken();
        res.status(200).send({ status: "Success", data: admin, token });
    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        } || "Error occurred");
    }
});

router.post("/admin/logout", auth, async(req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.admin.save();

        res.status(200).send({ message: "Logout Successful" });
    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        } || "Error occurred");
    }
});

router.post("/api/admin/logoutAll", auth, async(req, res) => {
    try {
        req.admin.tokens = [];
        await req.admin.save();

        res.status(200).send({ message: "Logout Successful" });
    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        } || "Error occurred");
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
            return cb(new Error("Please upload a valid image"));
        }

        cb(null, true);
    },
});

router.post("/api/admin/me/avatar", auth, upload.single("avatar"), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.admin.avatar = buffer;
    await req.admin.save();
    res.send("Uploaded successfully");
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.get("/api/admin/me/avatar", auth, (req, res) => {
    try {
        if (!req.admin.avatar) {
            throw new Error("Avatar not available");
        }

        res.set("Content-Type", "image/png");
        res.send(req.admin.avatar);
    } catch (e) {
        res.status(404).send({ error: "Avatar not found" });
    }
});

//GET /admin/
router.get('/api/admin/me', auth, async (req, res) => {
    res.status(200).send({status: "Success"})
})

router.patch("/api/admin/me", auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operation" });
    }

    try {
        updates.forEach((update) => {
            req.admin[update] = req.body[update];
        });

        await req.admin.save();
        res.send(req.admin);
    } catch (err) {
        res.status(400).send({ error: "Error occurred" });
    }
});

router.delete("/api/admin/me", auth, async(req, res) => {
    // const email = req.admin.email;
    // const name = req.admin.name;
    try {
        await req.admin.remove();
        // sendCancellationMessage(email, name)
        res.send({ message: "Deleted Successfully" });
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/api/admin/me/avatar", auth, async(req, res) => {
    req.admin.avatar = undefined;
    try {
        await req.admin.save();
        res.send({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;