const express=require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchuser");
const Bid=require('../models/bid');
const Item = require("../models/item");
const User = require("../models/user");

//place a bid
router.post("/bidding", fetchUser, async (req, res) => {
    const { name,price,description, amount } = req.body;
  
    try {
      // Fetch the item by itemId
      const item = await Item.findOne({
        name: name,
        price: price,
        description: description,
      });
      if (!item) {
        return res.status(404).json({ error: "Item not found." }); // Item not found
      }
      // Check if the bid amount is greater than the item's price
      if (amount <= item.price) {
        return res
          .status(400)
          .json({ error: "Bid amount must be greater than the current item price." });
      }
  
      // If the bid amount is valid, create the new bid
      const newBid = await Bid.create({
        userId: req.user.id,
        itemId: item.id,
        amount: amount,
      });
      res.status(201).json(newBid); // Bid placed successfully
    } catch (err) {
      console.error("Error placing bid:", err);
      res.status(500).json({ error: "Internal server error." });
    }
});

//find highest bid

router.post("/highestBidder", async (req, res) => {
  const { name, price, description } = req.body;

  try {
    // Find the item based on the provided details
    const item = await Item.findOne({
      name,
      price,
      description,
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    const itemId = item.id;
    // Find the highest bid for this item
    const highestBid = await Bid.findOne({ itemId }).sort({ amount: -1 });
    if (!highestBid) {
      // Return default values when there's no bid
      return res.status(200).json({
        highestBidderId: "NaN",
        highestBidder: "None",
        amount: 0,
      });
    }

    // Find the user who placed the highest bid
    const highestBidder = await User.findById(highestBid.userId);
    console.log(highestBidder);
    // Return the highest bidder information
    res.status(200).json({
      highestBidderId: highestBidder.id,
      highestBidder: highestBidder.name,
      amount: highestBid.amount,
    });

  } catch (err) {
    console.error("Error fetching highest bidder:", err);
    res.status(500).json({
      error: "An internal error occurred. Please try again later.",
    });
  }
});
  

module.exports = router;