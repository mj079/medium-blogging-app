const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const fs = require('fs')
const { MONGO_URL, JWT_SECRET } = require('./config')
const { UserModel } = require('./models/user')
const { PostModel } = require('./models/post')

const app = express();

mongoose.connect(MONGO_URL)

const uploadMiddleware = multer({ dest: 'uploads/' })

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'));

app.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const hashedPassword =  await bcrypt.hash(password, 5)
        const user = await UserModel.create({
            username,
            password: hashedPassword
        })
    
        res.status(200).json({
            username: user.username,
            userId: user._id
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (user) {
        const passOk = await bcrypt.compare(password, user.password)

        if(passOk) {
            jwt.sign({
                username,
                id: user._id
            }, JWT_SECRET, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json({
                    id: user._id,
                    username
                })
            })
        } else {
            res.status(400).json({
                message: "incorrect password"
            }) 
        }
    } else {
        res.status(400).json({
            message: "user not found"
        })
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;

    if(!token) {
        res.json({
            message: "token not provided"
        })
        return
    }

    jwt.verify(token, JWT_SECRET, {}, (err, info) => {
        if(err) throw err;
        res.json(info)
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {

    if (!req.file || !req.body.title || !req.body.summary || !req.body.content) {
        res.status(400).json("All fields are required");
        return
    }
    
    const { originalname, path } = req.file;
    const parts  = originalname.split('.');
    const ext  = parts[parts.length-1];
    const newPath = `${path}.${ext}`
    fs.renameSync(path, newPath);
        
    try {
        const { token } = req.cookies;

        jwt.verify(token, JWT_SECRET, {}, async(err, info) => {
            if(err) throw err;
            const { title, summary, content } = req.body

            const postDoc = await PostModel.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id
            })  
    
            res.json(postDoc)
        })
    } catch (error) {
        console.log(error);
    }
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    if (!req.file || !req.body.title || !req.body.summary || !req.body.content) {
        res.status(400).json("All fields are required");
        return
    }

    const { originalname, path } = req.file;
    const parts  = originalname.split('.');
    const ext  = parts[parts.length-1];
    const newPath = `${path}.${ext}`
    fs.renameSync(path, newPath);
    
    const { token } = req.cookies;
    jwt.verify(token, JWT_SECRET, {}, async(err, info) => {
        if (err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc = await PostModel.findByIdAndUpdate(id, {
            $set: {
                title,
                summary,
                content,
                cover: newPath  
            }
        }, { new: true });
    
        res.json(postDoc);
    })

})

app.get('/post', async (req, res) => {
    res.json(
        await PostModel.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    )
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await PostModel.findById(id)
    .populate('author', ['username']);

    res.json(postDoc)
})

app.listen(4000, () => {
    console.log("listenning at port 4000");
})