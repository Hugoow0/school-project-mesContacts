const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20,
        unique: true,
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
});

module.exports = mongoose.model("Contact", contactSchema);
