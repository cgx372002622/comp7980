// /* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });
// 用于生成和验证JWT Token的秘钥
const { JWT_SECRET } = require("../utils/configJWT"); // 引入JWT_SECRET
const { authorize } = require("../utils/authorize"); // 授权中间件


//使用散列密码存储
var bcrypt = require("bcrypt");
const saltRounds = 10; // bcrypt盐的轮次，可根据需要调整

var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

// 连接到MongoDB数据库
mongoose.connect(
  "mongodb://7980-assignment1:ACwzIOspmKS46eVYalaTSLG0y8fT89jH5whq3Hsxt6PZVZQOYJEUmsNvt7B2rUDoNGFYuM1veUrhACDbqCUawA%3D%3D@7980-assignment1.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@7980-assignment1@",
);

// 定义用户的模式 添加role进行鉴权
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, default: "user" }, // 默认为'user', 可以是 'admin'
});

// 为Schema创建模型
const User = mongoose.model("User", UserSchema, "shoppingdata");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* 用户登录 */
router.post("/login", async (req, res) => {
  try {
    // 查询数据库以获得用户信息
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send("User name does not exist");
    }

    // 使用bcrypt比较密码
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send("Incorrect Password");
    }
    console.log(user._id)
    // JWT签发
    const token = jwt.sign(
      { username: user.username, role: user.role, _id: user._id, email: user.email, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});

/* 用户注册 */
router.post("/register", async (req, res) => {
  try {
    // 检查用户名是否已经存在
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).send("Username already exists");
    }
    // 密码加密
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // 创建新用户
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role || "user",
    });

    // 保存新用户
    await newUser.save();

    // JWT签发
    const token = jwt.sign(
      { username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "2h" } // token 有效期设置为 2 小时
    );

    // 返回 token
    res.status(200).json({ message: "User Registration Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server Errors" });
  }
});



/* 修改用户信息 */
router.put("/:id", authorize(['user', 'admin']), async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;
    console.log(username);
    console.log(email);
    console.log(phoneNumber);

    // 检查必要的字段是否存在
    if (!username || !email || !phoneNumber) {
      return res.status(400).json({ message: 'Incomplete user data.' });
    }

    // 查找用户
    const user = await User.findById(req.params.id);

    // 检查用户是否存在
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 更新用户信息
    user.username = username;  // 确保也更新用户名
    user.email = email;
    user.phoneNumber = phoneNumber;
    console.log(user);
    // 保存更新后的用户文档
    const updatedUser = await user.save();
    console.log(updatedUser);

    // JWT Payload，确保在用户成功更新后执行
    const payload = {
      username: updatedUser.username,
      role: updatedUser.role
    };

    // JWT Sign
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    // 返回成功的响应
    res.status(200).json({
      data: updatedUser,
      message: 'User profile updated successfully.',
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error.' });
  }
});


/* 密码更改 */
router.put("/change-password/:id", authorize(['user', 'admin']), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 判断请求体中是否包含旧密码和新密码字段
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Incomplete password data.' });
    }

    // 查找用户
    const user = await User.findById(req.params.id);

    // 判断用户是否存在
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 使用bcrypt比较提供的旧密码是否正确
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send('Incorrect old password');
    }

    // 如果旧密码验证成功，将新密码进行bcrypt加密
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;

    // 保存更新后的密码
    const updatedUser = await user.save();

    // 返回成功的响应
    res.status(200).json({
      data: updatedUser,
      message: 'User password updated successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error.' });
  }
});




module.exports = router;
