import express from 'express';
import User from '../models/userModel.js';
import data from '../data.js';
import bcrypt from "bcryptjs"
import expressAsyncHandler from 'express-async-handler'

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

export default userRouter;