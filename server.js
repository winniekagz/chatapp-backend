
const mongoose=require("mongoose")
const express=require("express");
const dotenv=require("dotenv")
const helmet=require("helmet")
const morgan=require("morgan")
const cors=require("cors")
const app=express()
const path=require("path")
dotenv.config()

PORT=process.env.PORT
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

app.use(cors())
app.use("/api/users",require("./routes/user"))
app.use("/api/auth",require("./routes/auth"))
app.use("/api/private",require("./routes/private"))
app.use("/api/posts",require("./routes/Post"))

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);


const server=app.listen(PORT,()=>{
    console.log(`running on port ${PORT}`)
})

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});