import express from 'express';
import User from '../models/userModel.js';
import News from '../models/newsModel.js'
import data from '../data.js';
import bcrypt from "bcryptjs"
import expressAsyncHandler from 'express-async-handler'
import AlumniActivities from '../models/alumniActivities.js';

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

    console.log('saveNews')
    
    const num_of_news = await News.countDocuments();
    const id = num_of_news + 1;
    const content = req.body.content;
    const title = req.body.title;
    console.log(content)
    console.log(title)
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

    console.log('hello')
    
    const num_of_news = await AlumniActivities.countDocuments();
    const id = num_of_news + 1;
    const content = req.body.content;
    const title = req.body.title;
    const image_url = req.body.img_url
    console.log(content)
    console.log(title)
    try {
        const newsItem = new AlumniActivities({ _id: id, title: title, content:content, img_url:image_url });
        await newsItem.save();
        res.status(201).json(newsItem);
    } catch (err) {
        console.error('Error creating Alumni Activities:', err);
        res.status(500).json({ message: 'Failed to create Alumni Activities' });
    }
}))


userRouter.get('/news', async (req, res) => {
    const { page = 1, limit = 4 } = req.query;
    console.log(page)
    console.log(limit)
    try {
      const news = await News.find()
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching news data', error });
    }
  });

userRouter.get('/AlumniAct', async (req, res) => {
    const { page = 1, limit = 4, fetchAll = 0 } = req.query;

    try {
        if (parseInt(fetchAll) === 1){
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
        console.log('News not found');
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
    console.log('hello')
    
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

export default userRouter;