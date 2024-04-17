const { JWT_SECRET } = require("../utils/configJWT"); // 引入JWT_SECRET
const { authorize } = require("../utils/authorize"); // 授权中间件

var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

mongoose.connect(
  "mongodb://7980-assignment1:ACwzIOspmKS46eVYalaTSLG0y8fT89jH5whq3Hsxt6PZVZQOYJEUmsNvt7B2rUDoNGFYuM1veUrhACDbqCUawA%3D%3D@7980-assignment1.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@7980-assignment1@",
);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
});

const Product = mongoose.model("Product", ProductSchema, "productdata");

var express = require("express");
var router = express.Router();

// 仅管理员可以访问的路由
router.get("/admin-only", authorize("admin"), (req, res) => {
  res.send("仅管理员可见");
});

// 管理员和用户都可以访问的路由
router.get("/general", authorize(["admin", "user"]), (req, res) => {
  res.send("管理员和用户都可见");
});

// 获取所有商品
router.get("/products", authorize(["admin", "user"]), async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).send("服务器错误");
  }
});

// 获取单个商品详情
router.get("/products/:id", authorize(["admin", "user"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("商品未找到");
    }
    res.json(product);
  } catch (error) {
    res.status(500).send("服务器错误");
  }
});

// 添加新商品
router.post("/products", authorize(["admin"]), async (req, res) => {
  try {
    const newProduct = new Product({
      _id: new ObjectId(), // 生成新的ObjectId
      ...req.body,
    });
    console.log(newProduct);
    await newProduct.save();
    res.status(200).json({ message: "Add Product Success" });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

// 更新商品信息
router.put("/products/:id", authorize(["admin"]), async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Not find product" });
    }
    res.status(200).json({ data: updatedProduct, message: "Update Success" });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

// 删除商品
router.delete("/products/:id", authorize(["admin"]), async (req, res) => {
  try {
    const deletedProduct = await Product.deleteOne({ _id: req.params.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Do not find the product" });
    }
    res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

// 分页获取商品数据
router.get('/products/paginate/filter', authorize(["admin", "user"]),async (req, res) => {
  try {
    const { page = 1, pageSize = 100 } = req.query;
    const query = {}; // 可以根据需要增加查询条件
    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();

    res.json({
      total: totalCount,
      products: products,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.log(error)
    res.status(500).send("服务器错误: " + error.message);
  }
});


module.exports = router;
