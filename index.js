require("dotenv").config();
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");

//consts
const port = process.env.PORT;
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.STORAGE_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//mongoose

(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tree-storage");
    console.log("success");
  } catch (error) {
    console.log(error);
  }
})();

const File = require("./models/File");

//middleweres
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//api

app.post("/", upload.single("file"), async function (req, res, next) {
  try {
    const { originalname, path, size } = req.file;
    const newFile = await new File({
      name: originalname,
      path: path,
      size: size,
      extension: originalname.split(".").pop(),
    }).save();
    res.json(newFile);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
});

app.get("/", async (req, res) => {
  try {
    const files = await File.find({}).select("name size extension createdAt");
    res.json(files);
  } catch (error) {
    res.send(error);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const findFile = await File.findById(_id);
    res.sendFile(findFile.path);
  } catch (error) {
    res.json(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
