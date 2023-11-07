import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({ error: "You need to login first" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (err) {
    res.status(400).json({ error: "Something wrong with the token" });
    return;
  }
};

export const authentication = (req, res, next) => {
  const decoded = verifyToken(req, res, next);
  if (decoded) {
    req.id = decoded.user_id;
    next();
  }
};

export const authorization = (req, res, next) => {
  const decoded = verifyToken(req, res, next);
  if (decoded.user_id === req.id) {
    next();
  }
};

export const isAdmin = (req, res, next) => {
  if (req.id === process.env.ADMIN_ID) {
    return next();
  }

  return res.status(403).json({ error: "You are not authorized to do this" });
};
