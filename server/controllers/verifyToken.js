const jwt = require("jsonwebtoken");
const createError = require("http-errors");

exports.verifyToken = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    // res.json(user);
    next();
  });
};
exports.verifyUser = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
  });

  if (req.user.id === req.params.id || req.user.isAdmin) {
    res.json(req.user);
    next();
  } else {
    return next(createError(403, "You are not authorized!"));
  }
};

exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  const token = authHeader.split(" ")[1].toString();
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    console.log('verify Admin: ', user)
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });

 
};
