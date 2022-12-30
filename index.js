const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//mongoDB
const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.bfrcfcb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try {
        //collection
        const taskCollection = client.db('gtask').collection('tasks');
        const commentCollection = client.db('gtask').collection('comments');

        //api
        //post
        app.post('/add', async (req, res) => {
            // console.log(req.body);
            const doc = { ...req.body }
            const result = await taskCollection.insertOne(doc);
            res.send(result);
        });

        //post comment
        app.post('/addcomment', async (req, res) => {
            // console.log(req.body);
            const doc = { ...req.body }
            const result = await commentCollection.insertOne(doc);
            res.send(result);
        });

        //get
        app.get('/tasks', async (req, res) => {
            const query = { completed: false, userId: req.query.userid };
            const cursor = taskCollection.find(query);
            const data = await cursor.toArray();
            res.send(data)
        });

        //completed
        app.get('/completed', async (req, res) => {
            const query = { completed: true, userId: req.query.userid };
            const cursor = taskCollection.find(query);
            const data = await cursor.toArray();
            res.send(data)
        });

        //get comments

        app.get('/comments', async (req, res) => {
            // console.log(req.query);
            const query = { task_id: req.query.taskid };
            const cursor = commentCollection.find(query);
            const data = await cursor.toArray();
            res.send(data)
        });

        //delete task
        app.delete('/task', async (req, res) => {
            const id = ObjectId(req.query.id);
            const query = { _id: id };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

        //delete comment
        app.delete('/comment', async (req, res) => {
            const id = ObjectId(req.query.id);
            const query = { _id: id };
            const result = await commentCollection.deleteOne(query);
            res.send(result);
        });

        //patch update
        app.patch('/taskcompletion', async (req, res) => {
            const id = ObjectId(req.query.id);
            const filter = { _id: id };
            // const options = { upsert: true };
            const updateDoc = {
                $set: {
                    completed: req.body.completed
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        //edit get
        app.get('/edit/:id', async (req, res) => {
            const id = ObjectId(req.params.id);
            const query = { _id: id };
            const data = await taskCollection.findOne(query);
            res.send(data);
        });

        //edit update 
        app.put('/edit', async (req, res) => {
            const id = ObjectId(req.body._id);
            const filter = { _id: id };
            const options = { upsert: true };
            let updateDoc = {
                $set: {
                    title: req.body.title,
                    details: req.body.details,
                    bgColor: req.body.bgColor,
                    imageUrl: req.body.imageUrl
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });


    }
    finally {
        //
    }
}
run().catch(console.dir);




//api
app.get('/', (req, res) => {
    res.send('server11 running')
});



//run server
app.listen(port, () => {
    console.log('server running on port', port);
});
