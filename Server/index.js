const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoClient, ServerApiVersion , ObjectId} = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://PlayPulse:9DGJgLxxsCcn0YLb@playpulsedb.hjt9ma6.mongodb.net/PlaypulseDB?retryWrites=true&w=majority&appName=PlaypulseDB";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db('PlayPulseDB')
    const myColl = db.collection('Announcement');
    const myPostColl = db.collection('Post');

// post announcement
    app.post('/announcement',async(req,res)=>{
        const data = req.body;
        console.log(data)
        const result = await myColl.insertOne(data);
        res.send(result)
    })


// get announcement
      app.get('/announcement', async (req, res) => {
      try {
        const result = await myColl.find().toArray();
        res.send(result);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).send({ message: "Error fetching announcements" });
      }
    });



// delete announcement
    app.delete('/announcement/:id', async (req, res) => {
     try {
        const id = req.params.id;
        const result = await myColl.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Not found" });
        res.json(result);
      } catch (err) {
        console.error("Error deleting announcement:", err);
        res.status(500).json({ message: "Error deleting announcement" });
      }
    });



//post Post
     app.post('/post',async(req,res)=>{
        const data = req.body;
        console.log(data)
        const result = await myPostColl.insertOne(data);
        res.send(result)
    })



//get Post 
  app.get('/post', async (req, res) => {
      try {
        const result = await myPostColl.find().toArray();
        res.send(result);
      } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).send({ message: "Error fetching post" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
