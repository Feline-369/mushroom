import mongoose from "mongoose";

//database se jo connection aata h usme typescript inject kr rhe
//database connection k baad kya obj aa rha kya value chahiye kya datatype kya h 
//can be skipped since optional can cannot be returned 
type ConnectionObject={
    isConnected?: number
}

const connection: ConnectionObject ={}

//database connection takes time therefore async
//after connection is made it will return something hence promise(void)
//void suggest (in typescript) that idgaf what the datatype is 
async function dbConnect(): Promise<void> {
    //1st check if already connection 
    if (connection.isConnected) {
        console.log('Already connected to the database');
        return;
    } 

    try {
        //making connections
        const db=await mongoose.connect(process.env.MONGODB_URI || '',{})

        //an array we only take 1st one
        connection.isConnected=db.connections[0].readyState

        console.log("DB Connected Successfully")
    } catch (error) {
        console.log("Database connection failed", error);
        //exit the app
        process.exit(1)
    }
}

export default dbConnect;