import mongoose from 'mongoose';
import config from './config.js';

const connectDB = (database) => {
  try {
    const URI = config.DB_CONFIG.MONGODB_URI + database + config.DB_CONFIG.REMAINING_URI;
    
    mongoose.connect(URI);


  } catch (err) {
    console.error('Failed to connect to DB : ', err.message);
  }
};

export default connectDB;