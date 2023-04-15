const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: String,
    path: String,
    size: Number,
    extension: String,
    createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
