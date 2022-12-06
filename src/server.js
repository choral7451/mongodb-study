const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./models/User')

const MONGO_URI = 'mongodb+srv://daniel:a740857@mongodbtutorial.i1h7wnt.mongodb.net/BlogService?retryWrites=true&w=majority'

const server = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(MONGO_URI)


        app.use(express.json())

        app.get('/user', (req, res) => {
            // return res.send({ users })
        })

        app.post('/user', async (req, res) => {
            const user = new User( req.body )
            await user.save();
            return res.send({ user })
        })

        app.listen(3000, () => console.log('server listening on port 3000'))
    } catch(err) {
        console.log(err)
    }
}

server()

