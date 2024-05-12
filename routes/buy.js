const express=require("express");
const router = express.Router();
const Item=require('../models/item');
const Cart=require('../models/cart');
const User = require('../models/user');
const Bought = require('../models/bought');
const fetchUser = require("../middleware/fetchuser");


//changing bid active to false

router.post('/bought', async (req, res) => {
    try {
      const { itemId, userId, amount,name } = req.body;
      const bought = await Bought.create({
        userId,
        itemId,
        name,
        amount,
      });
      const delitem = await Item.findByIdAndDelete(itemId);
      const delcart = await Cart.findByIdAndDelete(itemId); 
      res.json(bought);
    } catch (error) {
      console.error('Error updating bid status:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  //getting all cartitems by userid
  router.get("/boughtcart",fetchUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Bought.find({ userId });
  
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


module.exports = router;