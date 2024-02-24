const mongoose = require("mongoose");
const timestamp = require('mongoose-timestamp');


const coachSchema = mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: Number, required: true },
  gym_medals: { type: Number, required:true },
});

coachSchema.plugin(timestamp);

module.exports = mongoose.model("Coach", coachSchema);
