// middleware.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./configJWT");

function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorised: No Token" });
      }
      jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
          console.log(err);
          return res.status(401).json({ message: "Unauthorised: Invalid Token" });
        }
        req.user = decoded;
        next();
      });
    },
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).json({ message: "No permission." });
      }
      next();
    },
  ];
}

module.exports = { authorize };
