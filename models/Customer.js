const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  spentAmount: { type: Number, required: true },
  inactiveDays: { type: Number, required: true },
  age: { type: Number, required: true },
});

module.exports = mongoose.model("Customer", customerSchema);