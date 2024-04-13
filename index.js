const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const port = 5000;
const { connect } = require("./db");
connect();

// const {mongoDB} = require("./db");
// mongoDB;


app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
    res.header(
        "Access-Control-Allow-Origin",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

let corspolicy = {
    origin:"http://localhost:3000"
}
app.use(cors(corspolicy));

app.use((req,res,next) => {
    console.log(" Request received at " + (new Date()));
    next();
});

app.use(express.json())
app.use('/api', require("./Routes/CreateUser"));


app.get('/',(req,res)=> {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})