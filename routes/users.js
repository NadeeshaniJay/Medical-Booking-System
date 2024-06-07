const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

function validateUserData(req, res, next) {
    const { firstname, lastname, mobilenumber, email, password, image } = req.body;
    if (!firstname || !lastname || !mobilenumber || !email || !password || !image) {
        res.status(400).json({ message: "All fields are required" });
    }
    next();
}

router.post("/add", validateUserData, async (req, res) => {
    const { firstname, lastname, mobilenumber, email, password, image } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            mobilenumber: Number(mobilenumber),
            email,
            password: hashedPassword,
            image,
        });

        await newUser.save();
        res.status(201).json("User added!");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error adding user", error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "user not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "incorrect password" });
        }

        return res.status(200).json({
            status: "success",
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                mobilenumber: user.mobilenumber,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ status: "error with login", message: error.message });
    }
});

module.exports = router;