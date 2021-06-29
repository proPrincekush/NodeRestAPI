const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { PORT } = require("./config");
const errorHandler = require("./middlewares/errorHandler");
app.use(cors());
const { DB_URL } = require("./config");
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

db.once("open", () => {
  console.log("DB Connected...");
});

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/uploads',express.static("uploads"))
app.use("/api", require("./routes"));

app.use(errorHandler);

const port = PORT || 5000;
app.listen(port, () => {
  console.log("server started ...");
});
