const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../config/supabase.config');
const authMiddleware = require('../middlewares/auth.middlewares');
const fileModel = require('../models/files.model');

const router = express.Router();
const upload = multer();


router.get('/home',authMiddleware,(req,res)=>{
    res.render('home');
})

router.post('/upload', authMiddleware, upload.single('uploadFile'), async (req, res) => {
    try {
        const fileStream = req.file.buffer;
        const fileName = req.file.originalname;
        const bucketName = 'testing'; // Replace with your bucket name

        const data = await uploadFile(fileStream, fileName, bucketName);

        const newFile = await fileModel.create({
            path: data.Key, // Assuming data.Key contains the file path in Supabase
            originalname: data.originalname,
            user: req.user.id,
        });

        res.status(200).json({ data: newFile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;