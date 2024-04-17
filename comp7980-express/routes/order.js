var express = require("express");
var router = express.Router();
const { authorize } = require("../utils/authorize");
const mongoose = require("mongoose");
const { Order } = require("./schemas");

mongoose.connect(
  "mongodb://7980-assignment1:ACwzIOspmKS46eVYalaTSLG0y8fT89jH5whq3Hsxt6PZVZQOYJEUmsNvt7B2rUDoNGFYuM1veUrhACDbqCUawA%3D%3D@7980-assignment1.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@7980-assignment1@"
);

router.get("/pagination", authorize(["user"]), async (req, res) => {
  try {
    const { current = 1, pageSize = 10 } = req.query;
    const query = {
      userId: req.user._id,
    };
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .skip((current - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    res.status(200).json({
      total,
      current,
      pageSize,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" + error });
  }
});

router.get("/paginationM", authorize(["admin"]), async (req, res) => {
  try {
    const { current = 1, pageSize = 10 } = req.query;
    const query = {};
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .skip((current - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    res.status(200).json({
      total,
      current,
      pageSize,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" + error });
  }
});

router.put("/send/:id", authorize(["admin"]), async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: 1,
    });
    res.status(200).json({ message: "Send successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" + error });
  }
});

router.get("/salesAnalysis", authorize(["admin"]), async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.productName",
          total: {
            $sum: "$products.count",
          },
        },
      },
      { $sort: { total: -1 } },
    ]).exec();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Errors" + error });
  }
});

router.get("/revenueAnalysis", authorize(["admin"]), async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.productName",
          total: {
            $sum: {
              $multiply: ["$products.productPrice", "$products.count"],
            },
          },
        },
      },
      { $sort: { total: -1 } },
    ]).exec();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Errors" + error });
  }
});

module.exports = router;
