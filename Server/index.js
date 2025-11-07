// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion , ObjectId} = require("mongodb");

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// const uri =
//   "mongodb+srv://PlayPulse:9DGJgLxxsCcn0YLb@playpulsedb.hjt9ma6.mongodb.net/PlaypulseDB?retryWrites=true&w=majority&appName=PlaypulseDB";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db('PlayPulseDB')
//     const myColl = db.collection('Announcement');
//     const myPostColl = db.collection('Post');

// // post announcement
//     app.post('/announcement',async(req,res)=>{
//         const data = req.body;
//         console.log(data)
//         const result = await myColl.insertOne(data);
//         res.send(result)
//     })


// // get announcement
//       app.get('/announcement', async (req, res) => {
//       try {
//         const result = await myColl.find().toArray();
//         res.send(result);
//       } catch (err) {
//         console.error("Error fetching announcements:", err);
//         res.status(500).send({ message: "Error fetching announcements" });
//       }
//     });



// // delete announcement
//     app.delete('/announcement/:id', async (req, res) => {
//      try {
//         const id = req.params.id;
//         const result = await myColl.deleteOne({ _id: new ObjectId(id) });
//         if (result.deletedCount === 0) return res.status(404).json({ message: "Not found" });
//         res.json(result);
//       } catch (err) {
//         console.error("Error deleting announcement:", err);
//         res.status(500).json({ message: "Error deleting announcement" });
//       }
//     });



// //post Post
//      app.post('/post',async(req,res)=>{
//         const data = req.body;
//         console.log(data)
//         const result = await myPostColl.insertOne(data);
//         res.send(result)
//     })



// //get Post 
//   app.get('/post', async (req, res) => {
//       try {
//         const result = await myPostColl.find().toArray();
//         res.send(result);
//       } catch (err) {
//         console.error("Error fetching post:", err);
//         res.status(500).send({ message: "Error fetching post" });
//       }
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//   }
// }



// run().catch(console.dir);
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("Connected to MongoDB Atlas");

//     app.listen(port, () => {
//       console.log(` Server running on port ${port}`);
//     });
//   })
//   .catch((err) => console.error("MongoDB connection error:", err));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const db = client.db("PlayPulseDB");
    const myColl = db.collection("Announcement");
    const myPostColl = db.collection("Post");

    // ---------------------- ANNOUNCEMENTS ----------------------
    app.post("/announcement", async (req, res) => {
      const data = req.body;
      const result = await myColl.insertOne(data);
      res.send(result);
    });

    app.get("/announcement", async (req, res) => {
      try {
        const result = await myColl.find().toArray();
        res.send(result);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).send({ message: "Error fetching announcements" });
      }
    });

    app.delete("/announcement/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await myColl.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0)
          return res.status(404).json({ message: "Not found" });
        res.json(result);
      } catch (err) {
        console.error("Error deleting announcement:", err);
        res.status(500).json({ message: "Error deleting announcement" });
      }
    });

    // ---------------------- POSTS ----------------------
    // Create new post
    app.post("/post", async (req, res) => {
      const data = req.body;
      data.likes = 0;
      data.comments = [];
      data.createdAt = new Date();
      const result = await myPostColl.insertOne(data);
      res.send(result);
    });

    // Get all posts
    app.get("/post", async (req, res) => {
      try {
        const result = await myPostColl.find().toArray();
        res.send(result);
      } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send({ message: "Error fetching posts" });
      }
    });

    // Add comment to a post
    app.post("/post/:id/comment", async (req, res) => {
      const { text, user } = req.body;
      const { id } = req.params;

      if (!text) return res.status(400).send({ message: "Comment text required" });

      try {
        const result = await myPostColl.updateOne(
          { _id: new ObjectId(id) },
          { $push: { comments: { text, user, createdAt: new Date() } } }
        );

        res.send(result);
      } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).send({ message: "Error adding comment" });
      }
    });

    // Get comments of a post
    app.get("/post/:id/comments", async (req, res) => {
      const { id } = req.params;
      try {
        const post = await myPostColl.findOne({ _id: new ObjectId(id) });
        if (!post) return res.status(404).send({ message: "Post not found" });
        res.send(post.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).send({ message: "Error fetching comments" });
      }
    });


    // Add like to a post
app.post("/post/:id/like", async (req, res) => {
  const { user } = req.body; // user info (e.g., displayName or email)
  const { id } = req.params;

  if (!user) return res.status(400).send({ message: "User required" });

  try {
    const post = await myPostColl.findOne({ _id: new ObjectId(id) });
    if (!post) return res.status(404).send({ message: "Post not found" });

    // Check if user already liked
    const alreadyLiked = post.likesUsers?.some((u) => u === user);
    if (alreadyLiked) return res.status(400).send({ message: "Already liked" });

    const result = await myPostColl.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { likes: 1 },
        $push: { likesUsers: user }, // array of users who liked
      }
    );

    res.send(result);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).send({ message: "Error liking post" });
  }
});


    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected!");
  } finally {
  }
}

run().catch(console.dir);

mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));