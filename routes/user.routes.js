const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { body,validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/register',(req,res)=>{
    res.render("register");
})

router.post('/register',
    body('email').trim().isEmail().isLength({min:8}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
    async (req,res)=>{
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            res.status(400).json({
                errors:errors.array(),
                message:"Invalid data"
            });
        }

        const {username,email,password}= req.body;

        const hashedpassword = await bcrypt.hash(password,10);

        const newuser = await userModel.create({
            username,
            email,
            password:hashedpassword
        })

        res.json(newuser); 
    }
);

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    async(req,res)=>{

        const errors =validationResult(req);

        if(!errors.isEmpty()){
            res.status(400).json({
                errors:errors.array(),
                message:"Invalid data"
            });
        }

        const {username,password}=req.body;

        const user = await userModel.findOne({
            username : username
        });

        if(!user){
            return res.status(400).json({
                message:"user or password is incorrect"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                message:"user or password is incorrect"
            })
        }
        
        const token = jwt.sign({
            id:user._id,
            username:user.username,
            email:user.email
        },process.env.JWT_SECRET);

        res.cookie('token',token);
        res.send('logged in');

})

module.exports = router;