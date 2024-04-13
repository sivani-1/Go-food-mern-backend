const express = require('express')
const router = express.Router()
const User = require('../models/User')
const {body, validationResult} = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "MynameisEndtoEndYoutubeChannel$#"
const Order = require('../models/Orders')

router.post("/createuser",[
body('email').isEmail(),
body('name').isLength({min: 5}),
//password must be at least 5 chars long
body('password').isLength({min: 5})]
,async(req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt)
    try{
        await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location: req.body.location
        })
    res.json({success:true});
    }catch(error){
        console.log(error);
        res.json({success:false});
    }
})

router.post("/loginuser",[
    body('email').isEmail(),
    body('password').isLength({min: 5})]
    ,async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        let email = req.body.email;
        try{
        let userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({errors: "try logging with correct credentials"})
        }
        const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
        if(!pwdCompare){
            return res.status(400).json({errors: "try logging with correct credentials"})
        }
        const data = {
            user:{
                id:userData.id
            }
        }
        const authToken = jwt.sign(data,jwtSecret)
        return res.json({success:true, authToken:authToken})

        }catch(error){
            console.log(error);
            res.json({success:false});
        }
})

router.post('/foodData',(req,res) => {
    try{
        // console.log(global.fooditems)
        res.send([global.fooditems,global.food_Category])
    }catch(error){
        console.error(error.message);
        res.send("server error")
    }
})

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
    // console.log("1231242343242354",req.body.email)

    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Order.findOne({ 'email': req.body.email })    
    console.log(eId)
    if (eId===null) {
        try {
            // console.log(data)
            // console.log("1231242343242354",req.body.email)
            await Order.create({
                email: req.body.email,
                order_data:[data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error")

        }
    }

    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error")
        }
    }
})

router.post('/myorderData', async (req,res) =>{
    try{
        let myData = await Order.findOne({'email': req.body.email})
        res.json({orderData:myData})
    }catch(error) {
        console.log(error.message)
        res.send("Server Error")
    }
})

module.exports=router;