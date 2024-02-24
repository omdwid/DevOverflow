import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);
  if(isConnected){
    console.log("mongoDb is already connected");
    return ;
  }

  if(!process.env.MONGODB_URL) {
    return console.log("Mongo Db Url does not exits");
  }

  
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "devflow"
    })
    console.log("MongoDb is connected");
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
}