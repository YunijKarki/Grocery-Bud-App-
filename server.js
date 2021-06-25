const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// enable cross origin request i.e. request from different domain
app.use(cors());

// that was json request made from axios. If only html form is used then it will be url encoded request
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/groceryDB", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const grocerySchema = new mongoose.Schema({
  _id: Number,
  title: { type: String, required: true },
});

const Grocery = mongoose.model("Groceries", grocerySchema);

app.get("/", (req, res) => {
  Grocery.find({}, (err, groceries) => {
    if (err) {
      console.log("Error:", err);
      req.send("Error");
    } else {
      res.send(groceries);
    }
  });
});

app.post("/api/add", (req, res) => {
  if (req.body._id && req.body.title) {
    const gross = new Grocery(req.body);
    gross.save();
    res.status(200).send("success");
  } else {
    req.status(501).send("Error: one or more values were found to be empty");
  }
});

app.post("/api/delete", (req, res) => {
  Grocery.findByIdAndRemove(req.body._id, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  });
});

app.post("/api/deletemany", (req, res) => {
  Grocery.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully deleted them all");
    }
  });
});
app.post("/api/edit", (req, res) => {
  Grocery.findByIdAndUpdate(
    req.body.editId,
    { $set: { title: req.body.title } },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully edited");
      }
    }
  );
});

app.listen(5000, () => {
  console.log("server successfully started");
});
