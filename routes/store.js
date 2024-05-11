const express=require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchuser");
const Item=require('../models/item');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;


//cloudinary          
cloudinary.config({
  cloud_name: 'dabc0kgo5',
  api_key: '715824876325468',
  api_secret: 'pEPHhCFOom_Yox1F5IOIRd7lK0Q',
});

// Set up Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }); 

// Function to upload image to Cloudinary and return the URL
function uploadImageToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error); // Reject if there's an error
      } else {
        resolve(result.url); // Resolve with the Cloudinary URL
      }
    });

    uploadStream.end(buffer); // End the stream with the buffer
  });
}

// Route handler for creating an item
router.post('/createitem', fetchUser, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    let imageUrl = null;
    if (req.file) {
      const imageBuffer = req.file.buffer; // Get the image buffer from Multer
      imageUrl = await uploadImageToCloudinary(imageBuffer); // Upload to Cloudinary and get the URL
    }

    const existingItem = await Item.findOne({
      name,
      price,
      description,
    });

    if (existingItem) {
      return res.status(409).json({ error: 'Item already exists.' });
    }

    const newItem = await Item.create({
      userId: req.user.id,
      name,
      price,
      description,
      image: imageUrl, // Store the Cloudinary image URL
    });

    console.log("userid",req.user.id);

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

//get all the items in the store
router.get("/allitems", async (req, res) => {
  try {
    const items = await Item.find();

    //when there are no items
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found." });
    }

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});
//delete all the items
router.delete("/delete", async (req, res) => {
  try {
    const result = await Item.deleteMany({}); // Deletes all items from the collection

    if (result.deletedCount === 0) {
      // If there were no items to delete
      return res.status(404).json({ message: "No items to delete." });
    }

    res.status(200).json({ message: `${result.deletedCount} items deleted.` });
  } catch (err) {
    console.error("Error deleting items:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});


//cart functionalities

router.get('/cart', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Item.find({ userId });

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No items found.' });
    }

    // Default values to be used when there's no highest bidder
    const defaultValues = {
      itemId: 'NaN',
      userId: 'NaN',
      itemName: 'NaN',
      highestBidder: 'NaN',
      highestBid: 0,
    };

    // Fetch the highest bidder data for each item
    const baseUrl = req.protocol + '://' + req.get('host'); // Correctly get the server base URL
    const highestBidderPromises = items.map(async (item) => {
      const { id, name, price, description, bidActive } = item;
      try {
        const response = await fetch(`${baseUrl}/bid/highestBidder`, {
          method: 'POST', // Keep the correct method based on previous explanations
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, price, description }),
        });

        const highestBidderData = await response.json();

        if (highestBidderData.error) {
          return {
            ...defaultValues,
            bidActive: bidActive,
            itemId: id,
            itemName: name,
          };
        }
        return {
          bidActive: bidActive,
          itemId: id,
          userId: highestBidderData.highestBidderId || defaultValues.userId,
          itemName: name,
          highestBidder: highestBidderData.highestBidder || defaultValues.highestBidder,
          highestBid: highestBidderData.amount || defaultValues.highestBid,
        };
      } catch (error) {
        console.error('Error fetching highest bidder data:', error);
        return {
          ...defaultValues,
          bidActive: bidActive,
          itemId: id,
          itemName: name,
        };
      }
    });

    // Wait for all fetch operations to complete
    const results = await Promise.all(highestBidderPromises);

    // Return the final results with default values for missing data
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching items or highest bidder:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//search item by name

router.post("/search", async (req, res) => {
  try {
    
    const items = await Item.find({
      name: { $regex: new RegExp(req.body.name, 'i') }, // 'i' for case-insensitive
    });

    //when there are no items
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found."});
    }

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});
module.exports = router;