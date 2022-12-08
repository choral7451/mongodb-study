const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./models/User')

const MONGO_URI = 'mongodb+srv://daniel:a740857@mongodbtutorial.i1h7wnt.mongodb.net/BlogService?retryWrites=true&w=majority'

const server = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology:true })
        mongoose.set('debug', true)
        console.log('MongoDB connected')
        app.use(express.json())

        app.get('/user', async (req, res) => {
            try {
                const users = await User.find()
                return res.send({ users })
            } catch (err) {
                return res.status(500).send({ err: err.message })
            }
        })

        app.get('/user/:id', async (req, res) => {
            try {
                const { id } = req.params
                if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ err: "invalid userId"})
                const user = await User.findOne({ _id: id })
                return res.send({ user })
            } catch (err) {
                return res.status(500).send({ err: err.message })
            }
        })

        app.delete('/user/:id', async (req, res) => {
            try {
                const { id } = req.params
                if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ err: "invalid userId"})
                const user = await User.deleteOne({ _id: id })
                return res.send({ user })
            } catch (err) {
                return res.status(500).send({ err: err.message })
            }
        })

        app.put('/user/:id', async (req, res) => {
            try {
                const { id } = req.params
                if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ err: "invalid userId"})
                const { age } = req.body;
                if(!age) return res.status(400).send({ err: "age is required"});
                if(typeof age !== 'number') return res.status(400).send({ err: "age must be a number"})
                const user = await User.findOneAndUpdate(id, { age }, { new: true})
                return res.send({ user })
            } catch (err) {
                return res.status(500).send({ err: err.message })
            }
        })

        app.post('/user', async (req, res) => {
            try{
                let { username, name } = req.body
                if(!username) return res.status(400).send({ err: "username is required"})
                if(!name || !name.first || !name.last) return res.status(400).send({ err: "Both first and last names are required"})
                const user = new User( req.body )
                await user.save();
                return res.send({ user })
            }catch (err) {
                return res.status(500).send({ err: err.message })
            }

        })

        app.listen(3000, () => console.log('server listening on port 3000'))
    } catch(err) {
        console.log(err)
    }
}

server()

