const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name, confirmPassword } = req.body;

      if (!email || !password || !name || !confirmPassword) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      let avatar = { public_id: '', secure_url: '' };
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'User-Avatars',
          });
          avatar = {
            public_id: result.public_id,
            secure_url: result.secure_url,
          };
          fs.rmSync(req.file.path); 
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error:', cloudinaryError);
          return res.status(500).json({ message: 'Error uploading avatar' });
        }
      }

      const user = new User({
        email,
        password,
        name,
        avatar,
        subscription: {
          status: 'inactive',
          active: false,
          expiryDate: null, 
        },
      });

      await user.save();

      const token = user.generateJWTToken();

      const responsePayload = {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          subscription: user.subscription,
        },
      };

      res.status(201).json(responsePayload);
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = user.generateJWTToken();

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          subscription: user.subscription, 
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Email already in use' });
        }
      }

      if (name) user.name = name;
      if (email) user.email = email;

      if (req.file) {
        try {
          if (user.avatar?.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
          }
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'User-Avatars'
          });

          user.avatar = {
            public_id: result.public_id,
            secure_url: result.secure_url,
          };

          fs.unlinkSync(req.file.path);
        } catch (cloudinaryError) {
          return res.status(500).json({ success: false, message: 'Error uploading avatar' });
        }
      }

      await user.save();

      const updatedUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription,
      };

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.userId).select('+password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription, 
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
