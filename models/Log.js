const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    campaignName: { type: String, required: true },
    sent: [ {
             customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
            message: { type: String, required: true },
        }],
    failed: 
    [  { type: mongoose.Schema.Types.ObjectId, required: true }
     ],
    timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log",logSchema);

module.exports = Log;