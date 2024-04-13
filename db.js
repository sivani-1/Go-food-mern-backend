const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.DBURI);
let connect = async () => { 
    try{  
        await mongoose.connect(process.env.DBURI);
        console.log(" connected to database");
        await client.connect();
        // database and collection code goes here
        const db = client.db("gofoodmern");
        const coll1 = db.collection("food_item");
        // find code goes here
        const cursor1 = coll1.find();
        // iterate code goes here
        //await cursor.forEach(console.log);
        global.fooditems= await cursor1.toArray();
        console.log(global.fooditems);

        const coll2 = db.collection("foodCategory");
        // find code goes here
        const cursor2 = coll2.find();
        // iterate code goes here
        //await cursor.forEach(console.log);
        global.food_Category= await cursor2.toArray();
        console.log(global.food_Category);
    }
    catch(err) {
        console.log(' error connecting');
    }
}

module.exports = {
    connect,
}

// const mongoURI = 'mongodb://sivanikanumuri:sivani2005@ac-qdhxxgv-shard-00-00.qrzyqhq.mongodb.net:27017,ac-qdhxxgv-shard-00-01.qrzyqhq.mongodb.net:27017,ac-qdhxxgv-shard-00-02.qrzyqhq.mongodb.net:27017/?ssl=true&replicaSet=atlas-mtw2pv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'
// const mongoDB =async() => {
//     await mongoose.connect(mongoURI, {useNewUrlParser: true},async(err, result) =>{
//         if(err) console.log("---",err)
//         else{
//             console.log("connected");
//     }
//     })
// }
// module.exports ={
//     mongoDB,
// }