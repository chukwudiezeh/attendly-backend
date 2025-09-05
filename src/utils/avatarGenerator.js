const { createCanvas } = require('canvas');
const cloudinary = require('cloudinary').v2;

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getRandomLightColor() {
  // Generate a random light color
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
}

function getDeeperColor(bgColor) {
  // Make the color deeper by reducing lightness
  return bgColor.replace(/(\d+)%\)$/, (match, l) => `${Math.max(30, l - 40)}%)`);
}

async function generateAvatarAndUpload(firstName, lastName) {
  const size = 256;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Colors
  const bgColor = getRandomLightColor();
  const textColor = getDeeperColor(bgColor);

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Initials
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  // Draw initials
  ctx.font = 'bold 120px "Arial Narrow", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png');

  // You need to wrap the upload_stream in a promise:
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'avatars' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { generateAvatarAndUpload };