const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/User')
const Note = require('./models/Note')
const port = 3000
app.use(express.json({extended: true}));
app.use(express.urlencoded());
mongoose.connect('mongodb://localhost:27017/notedetails')
.then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));


app.get('/', (req,res) => {
    res.sendFile("Pages/index.html", {root: __dirname});
})

app.get('/signup', (req,res) => {
    res.sendFile("Pages/signup.html", {root: __dirname});
})

app.get('/login', (req,res) => {
    res.sendFile("Pages/login.html", {root: __dirname});
})

app.post('/getnotes', async (req,res) => {
    let notes = await Note.find({email: req.body.email})
    res.status(200).json({success:true,notes})

})

app.post('/login', async (req,res) => {
    let user =  await User.findOne(req.body)
    if(!user){
        res.status(200).json({success:false, message: "User not found"})
    } else {
        res.status(200).json({success:true, user : {email : user.email}, message: "User found"})
       
    }
})

app.post('/signup', async(req,res) => {
    try {
        let newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        console.log(newUser)
        await newUser.save();  // Save the new user to the database
        res.status(200).json({ success: true, user: newUser });
        console.log("User added!")
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

app.post('/addnote', async (req,res) => {
    if(!localStorage.key('user')){
        alert("Please login first")
        res.sendFile("Pages/login.html", {root: __dirname});
    } else {
        const {userToken} = req.body;
        let note = await Note.create(req.body)
        res.status(200).json({success:true,note})
        

    }
})

app.post('/deletenote', async (req,res) => {
    try {
        let noteId = req.body.noteId;
        await Note.findByIdAndDelete(noteId);
        res.status(200).json({ success: true, message: "Note deleted" });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
});

app.post('/updatenote', async (req, res) => {
  try {
    let noteId = req.body.noteId;
    let updatedNote = { title: req.body.title, desc: req.body.desc };
    await Note.findByIdAndUpdate(noteId, updatedNote);
    res.status(200).json({ success: true, message: "Note updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});





app.listen(port, () => {
  console.log(`App Running on port ${port}`)
})