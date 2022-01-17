const User = require("../models/auth");
const express = require("express")
const bcrypt = require("bcryptjs");
const router=express.Router();
const ErrorResponse = require("../utilis/errorResponse");
// const  User  = require("../models/auth");

// update user
router.get("/",(req,res)=>{
    res.send("hey youusdfg")
})

router.put("/:id",async(req,res,next)=>{
    
   if (req.body.userId ===req.params.id||req.body.isAdmin){
       if (req.body.password){
           try {
               const salt=await bcrypt.genSalt(10);
               req.body.password=await bcrypt.hash(req.body.password,salt)
           } catch (err) {
            return next(new ErrorResponse("password not found", 500));
               
           }
        
       }
       try {
           const user=await User.findByIdAndUpdate(req.params.id,{
               $set:req.body,
           })
           res.status(200).json("account is updated")
       } catch (err) {
        return next(new ErrorResponse("user could not be updated", 500));
           
       }
   } else{
    return next("You can update only your account!",403); 
   }
})
// delete

router.delete("/:id",async(req,res,next)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"account has been deleted successfully!!"})
            
        } catch (err) {
                 return next("account could not be deleted",500) 
        }      
    }else{
            return next("account not found!!",403)


        

    }
})

// getting a user
router.get("/",async(req,res)=>{
    const userId=req.query.userId;
    const username=req.query.username;
    try {
        const user=userId ? 
            await User.findById(userId)
            :await User.findOne({username:username});
        const {password,updatedAt,...other}=user._doc;
        res.status(200).json(other)
        
        
    } catch (err) {
        res.status(500).json(err);
        
    }
})

// get friends
router.get("/friends/:userId",async(req,res)=>{
    try {
        const user=await user.findById(req.params.userId);
        const friends=await Promise.all(
            user.followings.map((friendId)=>{
                return User.findById(friendId)
            }));
            let friendList=[];
            friends.map((friend)=>{
                const {_id,userName,profilePicture}=friend;
                friendList.push({_id,userName,profilePicture})

            });
            res.status(200).json(friendList)

        
    } catch (err) {
        res.status(500).json(err)
        
    }
})
// follow user
router.put("/:id/follow",async(res,req,next)=>{
    if (req.body.userId!==req.params.id){
        try {
            const user=await findById(req.params.id);
            const currentUser=await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}})
                res.status(200).json(`you have successfully followed  user: ${username}`);
            }else{
                return next(new ErrorResponse("you already follow this user", 403));
 
            }
        } catch (error) {
            return next(new ErrorResponse("server error", 500));
            
        }
    }else{
        return next(new ErrorResponse("you cant follow yourself", 403));

    }
})

// unfollow user
router.put("/:id/unfollow",async(req,res,next)=>{
    if (req.body.userId !==req.params.id){
        try {
            const user=await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followings:req.body.userId }});
                await currentUser.updateOne({$pull:{ followings: req.params.id }})
            return next("user has been unfollowed",200)  
            }else{

            }
        } catch (err) {
            return next(new ErrorResponse("server error", 500)  )  
        }
        
    }else{
        return next(new ErrorResponse("you cant follow yourself", 403));
    }

    // 
})
module.exports=router;