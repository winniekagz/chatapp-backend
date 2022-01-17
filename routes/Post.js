const express=require("express")
const  router=express.Router()
const Post=require("../models/Post")
const User=require("../models/auth")
const ErrorResponse=require("../utilis/errorResponse")

// // update a post
router.get("/",(req,res)=>{
    res.send("hey youu")
})
router.put ("/:id",async (req,res,next)=>{
    
    try {
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("the post has been deleted")

        }else{
            return next(new ErrorResponse("yo can only update your post", 403));

            
        }
        
    } catch (error) {
        return next(new ErrorResponse("server error", 500));
       
    }
})

// // create post
router.post("/",async(req,res,next)=>{
    const newPost=new Post (req.body)
    try {
        const savedPost=await newPost.save()
        res.status(200).json(savedPost)
        
    } catch (error) {
        return next(new ErrorResponse("server error", 500));
        
    }
})

// delete post
router.delete("/:",async (req,res,next)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne({})
            res.status(200).json("the post has been deleted")

        }else{
            return next(new ErrorResponse("yo can only delete your post", 403));

            
        }
        
    } catch (error) {
        return next(new ErrorResponse("server error", 500));
       
    }
})
// like/dislike a post
router.put("/id/like",async(req,res,next)=>{
    try {
        const  post=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("The post has been liked");
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("The post has been disliked");
        }
        
    } catch (error) {
        return next(new ErrorResponse("server error", 500));
    }
})

// get a post
router.get("/:id",async(req,res,next)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
      } catch (err) {
        return next(new ErrorResponse("server error", 500));

       
      }
    });

// get timeline post
router.get("/timeline/:userId",async(req,res,next)=>{
    try {
        const currentUser=await User.findById(req.params.userId);
        const userPosts=await Post.find({ userId: currentUser._id})
        const friendPosts=await Promise.all(
            currentUser.following.map((friendId)=>{
                return Post.find({ userId: friendId });
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
        
    } catch (error) {
        return next(new ErrorResponse("server error", 500));
        
    }
})
router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
        return next(new ErrorResponse("server error", 500));
        
    }
  });

module.exports=router;
