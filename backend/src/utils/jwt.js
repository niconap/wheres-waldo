const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'default';

function sign(payload) {
  return jwt.sign(payload, SECRET);
}

function verify(token) {
  return jwt.verify(token, SECRET);
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = verify(token);
  } catch (err) {
    return res.sendStatus(403);
  }
  next();
}

module.exports = { sign, authenticateJWT };
