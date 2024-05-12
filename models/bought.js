const mongoose = require("mongoose");

const BoughtSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        itemId: {
            type: String,
            required: true,
        },
        name:{
            type:String,
            required:true,
        },
        amount: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const Bought = mongoose.model('Bought', BoughtSchema);
module.exports = Bought;