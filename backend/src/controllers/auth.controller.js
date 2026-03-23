const admin = require('../config/firebase');
const { db } = require('../config/database');
const { generateToken } = require('../utils/jwt');

const verifyToken = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'idToken is required',
      });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decoded.uid;

    let user = await db('users').where({ firebase_uid: firebaseUid }).first();

    if (!user) {
      const phone = decoded.phone_number || decoded.phoneNumber;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required in Firebase token',
        });
      }

      const [createdUser] = await db('users')
        .insert({
          firebase_uid: firebaseUid,
          name: decoded.name || null,
          phone,
          email: decoded.email || null,
          role: 'customer',
          avatar_url: decoded.picture || null,
          is_active: true,
        })
        .returning('*');

      user = createdUser;
    }

    const token = generateToken(user.id, user.role);

    return res.json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await db('users').where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  verifyToken,
  getMe,
};
