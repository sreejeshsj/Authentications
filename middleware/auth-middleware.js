const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please Login to continue",
    });
  }

  //decode this token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);

    req.userinfo = decodedToken;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Access denied1. Please Login to continue",
    });
  }
};

module.exports = authMiddleware;
