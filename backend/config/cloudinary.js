const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Learning-Management-System/lessons',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
    eager: [
      { streaming_profile: 'full_hd' }, 
      { quality: 'auto' }
    ],
    eager_async: true, 
  },
});

const videoUpload = multer({ storage: videoStorage });

module.exports = { cloudinary, videoUpload };