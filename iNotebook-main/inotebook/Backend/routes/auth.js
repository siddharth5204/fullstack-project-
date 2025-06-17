const express = require('express')
const router = express.Router()
const { body,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const fetchuser = require('../middleware/fetchUser')

const JWT_SECERET = "Spartanisakiller"

//ROUTE 1: Create a User using: POST "/api/auth/createUser" . Doesn't require Auth
router.post('/createUser',[
    body('name','Enter a valid name').isLength({min:5}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must have atleast 5 characters').isLength({min:5}),
    ],async(req,res)=>{
    // If there are errors, send Bad request and errors
        let success = false;
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors:errors.array()})
        }
        try{
            // Check whether the user with email already exists
            let user = await User.findOne({email:req.body.email}) 
            if(user){
                return res.status(400).json({success,errors: "Sorry a user with this email already exists"})
            }

            const salt = await bcrypt.genSalt(10);      
            const secPass =await bcrypt.hash(req.body.password,salt)

            // Create a new user
            user = await User.create({
                name:req.body.name,
                password: secPass,
                email:req.body.email
            })

            const data = {
                user:{
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data,JWT_SECERET)
            console.log(authtoken)
            success = true
            res.json({success,authtoken})
        }catch(error){
            console.log(error.message)
            res.status(500).send("Internal Error Occured")
        }   
    }
)

//ROUTE 2: Authenticating a User using: POST "/api/auth/login" . Doesn't require Auth
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
    ],async(req,res)=>{
        // If there are errors, send Bad request and errors
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const {email,password} = req.body
        try {
            user = await User.findOne({email})
            if(!user){
                success=false
                return res.status(400).json({success,error:"Please try to login with correct Credentials"})
            }
            const passwordCompare = await bcrypt.compare(password,user.password);
            if(!passwordCompare){
                success=false
                return res.status(400).json({success,error:"Please try to login with correct Credentials"})
            }
            const data = {
                user:{
                    id: user.id
                }
            }
            success = true
            const authtoken = jwt.sign(data,JWT_SECERET)
            res.json({success,authtoken})
        } catch (error) {
            console.log(error.message)
            res.status(500).send("Internal Server Error")
        }
    }
)


//ROUTE 2: Get logged in User detail: POST "/api/auth/getUser" . Login required
router.post('/getUser',fetchuser,async(req,res)=>{
        try {
            userId = req.user.id
            const user = await User.findById(userId).select("-password")
            res.send(user)
        } catch (error) {
            console.log(error.message)
            res.status(500).send("Internal Server Error")
        }
    }
)

module.exports = router 