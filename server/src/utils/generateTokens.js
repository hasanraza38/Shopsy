import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_JWT_SECRET, { expiresIn: '1d' });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' });
}

export { generateAccessToken, generateRefreshToken };