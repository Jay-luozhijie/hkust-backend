import express from 'express';
import User from '../models/userModel.js';
import News from '../models/newsModel.js'
import data from '../data.js';
import bcrypt from "bcryptjs"
import expressAsyncHandler from 'express-async-handler'
import AlumniActivities from '../models/alumniActivities.js';
import multer from 'multer';
import crypto from 'crypto';
import FormData from 'form-data';
import axios from 'axios'

const userRouter = express.Router();

userRouter.get('/seed', async (req, res) => {
    const createdUsers = await User.insertMany(data.users);
    res.send({createdUsers});
});

userRouter.post('/login', expressAsyncHandler(async(req, res) =>{
    const user = await User.findOne({name: req.body.name});
    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send("correct")
        }
        return;
    }
    res.status(401).send({message:"Invalid name or password"})
}))

userRouter.post('/saveNews', expressAsyncHandler(async(req, res) =>{
    
    const num_of_news = await News.countDocuments();
    const id = num_of_news + 1;
    const content = req.body.content;
    const title = req.body.title;
    try {
        const newsItem = new News({ _id: id, title: title, content:content });
        await newsItem.save();
        res.status(201).json(newsItem);
    } catch (err) {
        console.error('Error creating news:', err);
        res.status(500).json({ message: 'Failed to create news' });
    }
}))


userRouter.post('/saveAlumniAct', expressAsyncHandler(async(req, res) =>{
    const num_of_news = await AlumniActivities.countDocuments();
    const id = num_of_news + 1;
    const content = req.body.content;
    const title = req.body.title;
    const image_url = req.body.img_url
    try {
        const newsItem = new AlumniActivities({ _id: id, title: title, content:content, img_url:image_url });
        await newsItem.save();
        res.status(201).json(newsItem);
    } catch (err) {
        console.error('Error creating Alumni Activities:', err);
        res.status(500).json({ message: 'Failed to create Alumni Activities' });
    }
}))

userRouter.delete('/news/:id', async (req, res) => {
    try {
        const newsItem = await News.findByIdAndDelete(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ error: 'News item not found' });
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

userRouter.get('/news', async (req, res) => {
    const { page = 1, limit = 4, isAll = 0 } = req.query;
    try {
        if (parseInt(isAll) == 1){
            const news = await News.find()
            .sort({ updatedAt: -1 });
            res.json(news);
        } else{
            const news = await News.find()
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
            res.json(news);
        }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching news data', error });
    }
  });

userRouter.delete('/AlumniAct/:id', async (req, res) => {
    try {
        const newsItem = await AlumniActivities.findByIdAndDelete(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ error: 'News item not found' });
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


userRouter.get('/AlumniAct', async (req, res) => {
    const { page = 1, limit = 4, isAll = 0 } = req.query;

    try {
        if (parseInt(isAll) === 1){
            let news = await AlumniActivities.find().sort({ updatedAt: -1 })
            res.json(news);
        } else {
            let news = await AlumniActivities.find()
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
            res.json(news);
        }
     
      
    } catch (error) {
      res.status(500).json({ message: 'Error fetching alumni activity data', error });
    }
  });



userRouter.get('/newsDetail', async (req, res) => {
    const { id = 1 } = req.query;
    
    try {
        const news = await News.findById(id);
    if (!news) {
        // Handle case where news with given ID is not found
    } else {
        res.json(news);
    }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news data', error });
    }
});

userRouter.get('/activitiesDetail', async (req, res) => {
    const { id = 1 } = req.query;
    
    try {
        const news = await AlumniActivities.findById(id);
    if (!news) {
        console.log('News not found');
        // Handle case where news with given ID is not found
    } else {
        res.json(news);
    }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities data', error });
    }
});


const apiKey = '487875633899292'
const apiSecret = 'bLvtV6530MoXNn8ifA-0b9NoR5Y';
const uploadPreset = 'ml_default';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudName = 'dqhobzrs1'

userRouter.post('/generateImageUrl', upload.single('file'), async (req, res) => {
    // const { id = 1 } = req.query;
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}`;
    const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex');

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('signature', signature);
    formData.append('upload_preset', uploadPreset);
    console.log(formData)

    try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
            headers: { ...formData.getHeaders() }
        });
        res.json({ secure_url: response.data.secure_url });
    } catch (error) {
        console.error('Error uploading the image', error);
        res.status(500).send('Error uploading the image.');
    }
    // try {
    //     const news = await AlumniActivities.findById(id);
    // if (!news) {
    //     console.log('News not found');
    //     // Handle case where news with given ID is not found
    // } else {
    //     res.json(news);
    // }
    // } catch (error) {
    //     res.status(500).json({ message: 'Error fetching activities data', error });
    // }
});


export default userRouter;