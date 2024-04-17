var express = require("express");
var router = express.Router();
const { authorize } = require("../utils/authorize");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Order } = require("./schemas");

mongoose.connect(
  "mongodb://7980-assignment1:ACwzIOspmKS46eVYalaTSLG0y8fT89jH5whq3Hsxt6PZVZQOYJEUmsNvt7B2rUDoNGFYuM1veUrhACDbqCUawA%3D%3D@7980-assignment1.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@7980-assignment1@"
);

const CartSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  count: { type: Number, required: true },
});

const Cart = mongoose.model("Cart", CartSchema, "cart");

router.get("/pagination", authorize(["user"]), async (req, res) => {
  try {
    const { current = 1, pageSize = 10 } = req.query;
    const query = {
      userId: req.user._id,
    };
    const total = await Cart.countDocuments(query);
    const cart = await Cart.aggregate([
      {
        $addFields: {
          convertedId: { $toObjectId: "$productId" },
        },
      },
      {
        $lookup: {
          from: "productdata",
          localField: "convertedId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $match: {
          userId: req.user._id,
        },
      },
    ])
      .skip((current - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    res.status(200).json({
      total,
      current,
      pageSize,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" + error });
  }
});

router.post("/add", authorize(["user"]), async (req, res) => {
  try {
    const cartItem = await Cart.findOne(req.body);
    if (cartItem) {
      await Cart.findByIdAndUpdate(cartItem._id, {
        count: cartItem.count + 1,
      });
    } else {
      const newCartItem = new Cart({
        _id: new ObjectId(),
        count: 1,
        ...req.body,
      });
      await newCartItem.save();
    }
    res.status(200).json({ message: "Add product successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

router.put("/plus/:id", authorize(["user"]), async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (cartItem) {
      await Cart.findByIdAndUpdate(req.params.id, {
        count: cartItem.count + 1,
      });
      res.status(200).json({ message: "Increase item successfully" });
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

router.put("/minus/:id", authorize(["user"]), async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (cartItem) {
      if (cartItem.count > 0) {
        await Cart.findByIdAndUpdate(req.params.id, {
          count: cartItem.count - 1,
        });
        res.status(200).json({ message: "Reduce item successfully" });
      }
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

router.delete("/delete/:id", authorize(["user"]), async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Delete cart item successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

router.post("/check", authorize(["user"]), async (req, res) => {
  try {
    const newOrder = new Order({
      _id: new ObjectId(),
      time: new Date(),
      products: req.body.products,
      userId: req.user._id,
      userName: req.user.username,
      money: req.body.money,
      status: 0,
    });
    await newOrder.save();
    await Cart.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: "Check cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" + error });
  }
});

module.exports = router;
