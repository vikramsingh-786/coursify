const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, 'Name must be at least 3 characters'],
    maxLength: [20, 'Name should be less than 20 characters'],
    lowercase: true,
    trim: true
  },
  avatar: {
    public_id: {
      type: String
    },
    secure_url: {
      type: String
    }
  },
  subscription: {
    id: {
      type: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'created'],
      default: 'inactive'
    },
    expiryDate: {
      type: Date // Track expiry date for the subscription
    }
  },
  forgotPasswordToken: {
    type: String
  },
  forgotPasswordExpiry: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 12);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods = {
  generateJWTToken: function () {
    return jwt.sign(
      { id: this._id, email: this.email, role: this.role }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
  },

  generatePasswordResetToken: async function () {
    const resetToken = await crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken = await crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  }
};

module.exports = mongoose.model('User', userSchema);
