const express = require("expnode server.jsress");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect("mongodb://127.0.0.1:27017/productivity");

const app = express();
app.use(cors());
app.use(express.json());

const TimeSchema = new mongoose.Schema({
  userId: String,
  domain: String,
  timeSpent: Number,
  date: String
});

const Time = mongoose.model("Time", TimeSchema);

app.post("/api/time", async (req, res) => {
  const entry = new Time(req.body);
  await entry.save();
  res.send("Saved");
});

app.get("/api/report/:userId", async (req, res) => {
  const data = await Time.find({ userId: req.params.userId });
  res.json(data);
});

app.listen(5000, () => console.log("Server running on port 5000"));
