const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BlogPost = require('../models/BlogPost');
const Gallery = require('../models/Gallery');
const SocialMedia = require('../models/SocialMedia');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: './src/config/config.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Blog post seed data
const blogPosts = [
  {
    title: "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें, आज की क़द्र करेंगे तो ही कल बनता है",
    slug: "ham-pe-laazim-hai-ki-ham-waqt-ko-zaaya-na-karein",
    excerpt: "हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें, आज की क़द्र करेंगे तो ही कल बनता है ...",
    image: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742234779/imagr2_l80wqe.jpg",
    date: "December 6, 2024",
    likes: 31,
    content: `
      <p>हम पे लाज़िम है कि हम वक़्त को ज़ाया न करें</br>
      आज की क़द्र करेंगे तो ही कल बनता है</br>
      तपना पड़ता है मुक़द्दर को बनाने के लिए</br>
      खारा पानी तभी बरसात का जल बनता है</br>
      उम्र लगती है तो लहजा ए ग़ज़ल बनता है</br>
      एक दो दिन में कहीं ताजमहल बनता है</br>
      उसने इल्ज़ाम लगाया तो ये हक़ है मेरा</br>
      यार अहसान का इतना तो बदल बनता है</p>
    `,
    isPublished: true
  },
  {
    title: "पहली मोहब्बत, पहली मोहब्बत होती है",
    slug: "detoxing-my-social-media-feed",
    excerpt: "आदमी किस तरह हालात से उभर के चलता है, इसका एक अच्छा उदाहरण आपके सामने है...",
    image: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742233800/image_tqophb.jpg",
    date: "January 15, 2025",
    likes: 24,
    content: `
      <p>पहली मोहब्बत, पहली मोहब्बत होती है</br>
      दिल की सरहद पर पहली हिफाज़त होती है</br>
      ज़िन्दगी भर चलता है उसका असर</br>
      एक बरसात में पहली बारिश होती है</p>
    `,
    isPublished: true
  },
  {
    title: "उनको सीने से लगा जो हैं मुख़ालिफ़ तेरे",
    slug: "unko-sine-se-laga-jo-hain-mukhalif-tere",
    excerpt: "उनको सीने से लगा जो हैं मुख़ालिफ़ तेरे...",
    image: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742236807/image3_dak6e6.jpg",
    date: "February 28, 2025",
    likes: 42,
    content: `
      <p>उनको सीने से लगा जो हैं मुख़ालिफ़ तेरे</br>
      हाँ तू ऐसा ही रहे, हम तो यही चाहेंगे</p>
    `,
    isPublished: true
  }
];

// Gallery seed data
const galleryImages = [
  {
    title: "Gallery Image 1",
    description: "Beautiful moment captured at sunset",
    imageUrl: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742233800/image_tqophb.jpg",
    displayOrder: 1,
    isActive: true
  },
  {
    title: "Gallery Image 2",
    description: "Nature at its best",
    imageUrl: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742234779/imagr2_l80wqe.jpg",
    displayOrder: 2,
    isActive: true
  },
  {
    title: "Gallery Image 3",
    description: "Peaceful moment",
    imageUrl: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742236807/image3_dak6e6.jpg",
    displayOrder: 3,
    isActive: true
  },
  {
    title: "Gallery Image 4",
    description: "Another beautiful moment",
    imageUrl: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237648/4_reuuyf.jpg",
    displayOrder: 4,
    isActive: true
  },
  {
    title: "Gallery Image 5",
    description: "Memories to cherish",
    imageUrl: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237648/3_l63y7r.jpg",
    displayOrder: 5,
    isActive: true
  },
  {
    title: "Gallery Image 6",
    description: "Special moments",
    imageUrl: "https://res.cloudinary.com/djxuqljgr/image/upload/v1742237647/2_bqzsdp.jpg",
    displayOrder: 6,
    isActive: true
  }
];

// Social media seed data
const socialMediaLinks = [
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/DG3G0vZzONi/?utm_source=ig_embed&utm_campaign=loading",
    displayOrder: 1,
    isActive: true
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/CvHvIy0JKz1/?utm_source=ig_embed&utm_campaign=loading",
    displayOrder: 2,
    isActive: true
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/DHGLv8oIfh_/?utm_source=ig_embed&utm_campaign=loading",
    displayOrder: 3,
    isActive: true
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/DHBiGO2Twpl/?utm_source=ig_embed&utm_campaign=loading",
    displayOrder: 4,
    isActive: true
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/DG8bsq4TZx9/?utm_source=ig_embed&utm_campaign=loading",
    displayOrder: 5,
    isActive: true
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/DFXozAsTC7A/?utm_source=ig_embed&utm_campaign=loading",
    displayOrder: 6,
    isActive: true
  }
];

// Admin user seed data
const adminUser = {
  name: 'Aadil Rasheed',
  email: 'admin@aadilrasheed.com',
  password: 'password123',
  role: 'admin'
};

// Function to import data into database
const importData = async () => {
  try {
    // Delete existing data
    await BlogPost.deleteMany();
    await Gallery.deleteMany();
    await SocialMedia.deleteMany();
    
    // Check if admin user exists, if not create it
    const userExists = await User.findOne({ email: adminUser.email });
    if (!userExists) {
      await User.create(adminUser);
      console.log('Admin user created!');
    }
    
    // Insert new data
    await BlogPost.insertMany(blogPosts);
    await Gallery.insertMany(galleryImages);
    await SocialMedia.insertMany(socialMediaLinks);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy data from database
const destroyData = async () => {
  try {
    // Delete all data
    await BlogPost.deleteMany();
    await Gallery.deleteMany();
    await SocialMedia.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Determine which action to run based on command argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
