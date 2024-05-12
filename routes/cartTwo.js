const express=require("express");
const router = express.Router();
const Item=require('../models/item');
const Cart=require('../models/cart');
const User = require('../models/user');
const fetchUser = require("../middleware/fetchuser");


//changing bid active to false

router.patch('/stopbid', async (req, res) => {
    try {
      const { itemId, userId, amount,name } = req.body;
  
      // Find and update the item to set `bidActive` to false
      const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        { bidActive: false },
        { new: true }
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      // Create a new Cart entry
      const cartEntry = await Cart.create({
        userId,
        itemId,
        name,
        amount,
      });
  
      // Return both updatedItem and cartEntry in a single object
      res.status(200).json({
        updatedItem,
        cartEntry,
      });
    } catch (error) {
      console.error('Error updating bid status:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  //getting all cartitems by userid
  router.get("/allcart",fetchUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.find({ userId });
  
      //when there are no items
      if (!cart || cart.length === 0) {
        return res.status(404).json({ message: "No items found." });
      }
  
      res.status(200).json(cart);
    } catch (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  //findling user name
  router.get("/name",fetchUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      res.status(200).json({name:user.name,id:user.id});
    } catch (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  

module.exports = router;