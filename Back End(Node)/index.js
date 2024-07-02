const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { createHandler } = require("graphql-http/lib/use/express");
const app = express();
const port = 8080;

require("dotenv").config();

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `Image-${file.originalname}`);
  },
});

const imageFilter = (req, file, cb) => {
  const validImages = ["image/png", "image/jpeg", "image/jpg"];
  if (validImages.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded({ extended: true })); //* uses x-www-form-urlencoded
app.use(bodyParser.json()); //* uses application/json
app.use(
  multer({ storage: fileStorage, fileFilter: imageFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

//! FOR SOLVING CORS ORIGIN ERRORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  "/graphql",
  createHandler({ schema: graphqlSchema, rootValue: graphqlResolver })
);

app.use((error, req, res, next) => {
  const { statusCode, message, data } = error;
  res.status(statusCode || 500).json({ message, data });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((error) => {
    console.log("🚀 ~ error:", error);
  });
