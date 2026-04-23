import jwt from 'jsonwebtoken';
import prisma from '../models/prisma.js';

const SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Verify JWT signature & expiry
    const decoded = jwt.verify(token, SECRET);

    // 2. Check token exists in DB and is NOT blacklisted
    const tokenRecord = await prisma.token.findFirst({
      where: {
        token,
        blacklisted: false,
        expires: { gt: new Date() }, // not expired in DB either
      },
    });

    if (!tokenRecord) {
      return res.status(401).json({ message: 'Token is invalid or has been revoked' });
    }

    // 3. Attach user to request
    req.user = decoded; // { userId, iat, exp }
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};