const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generationToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "please fill all the fields" });
        }
        //check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "user already exists" });
        }
        //create user
        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({
                message: "User registered successfully",
                token: generationToken(user._id),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            res.json({
                message: "login succesful",
                token: generationToken(user._id),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        }
        else {
            res.status(401).json({ message: "invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isPro: user.isPro,

        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateUserProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
            })
        }
        else {
            res.status(404).json({ message: "user not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}
