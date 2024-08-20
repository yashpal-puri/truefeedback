import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    try {
        if(connection.isConnected){
            console.log("Database is already connected");
            return;
        }

        const dbcn = await mongoose.connect(process.env.MONGODB_URI?.toString() || '');

        console.log("Connection Object is - ", dbcn);

        connection.isConnected = dbcn.connections[0].readyState;

        console.log("Database connected successfully");
        
    } catch (error) {
        console.log("Some error in database connection", error);
        process.exit(1);
    }
}

export default dbConnect;