require("dotenv").config({ path: "./local.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// load PORT from env if available
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Now this will not be undefined
const uri = process.env.MONGO_URI;

// ------------------ MongoDB Connection ------------------
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();
    const db = client.db("PlayPulseDB");
    const myColl = db.collection("Announcement");
    const myPostColl = db.collection("Post");
    const turfsCollection = db.collection("Turfs");
    const playersCollection = db.collection("players");
    const bookingsCollection = db.collection("bookings");
    const matchesCollection = db.collection("matches");

    // ---------------------- ANNOUNCEMENTS ----------------------

    app.post("/announcement", async (req, res) => {
      try {
        const data = req.body;
        const result = await myColl.insertOne(data);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding announcement" });
      }
    });

    app.get("/announcement", async (req, res) => {
      try {
        const result = await myColl.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching announcements:", error);
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
      } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ message: "Error deleting announcement" });
      }
    });

    // ---------------------- POSTS ----------------------

    // Create new post
    app.post("/post", async (req, res) => {
      const data = req.body;
      data.likes = 0;
      data.likesUsers = [];
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
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send({ message: "Error fetching posts" });
      }
    });

    // Add comment to post
    app.post("/post/:id/comment", async (req, res) => {
      const { text, user } = req.body;
      const { id } = req.params;

      if (!text)
        return res.status(400).send({ message: "Comment text required" });

      try {
        const result = await myPostColl.updateOne(
          { _id: new ObjectId(id) },
          { $push: { comments: { text, user, createdAt: new Date() } } }
        );

        res.send(result);
      } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).send({ message: "Error adding comment" });
      }
    });

    // Get comments
    app.get("/post/:id/comments", async (req, res) => {
      const { id } = req.params;
      try {
        const post = await myPostColl.findOne({ _id: new ObjectId(id) });
        if (!post) return res.status(404).send({ message: "Post not found" });
        res.send(post.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send({ message: "Error fetching comments" });
      }
    });

    // Like / Unlike post
    app.post("/post/:id/like", async (req, res) => {
      try {
        const postId = req.params.id;
        const { user } = req.body;

        if (!user) return res.status(400).json({ message: "User is required" });

        const post = await myPostColl.findOne({ _id: new ObjectId(postId) });
        if (!post) return res.status(404).json({ message: "Post not found" });

        const likesUsers = post.likesUsers || [];
        const likes = post.likes || 0;

        const hasLiked = likesUsers.includes(user);

        let updatedDoc;
        if (hasLiked) {
          updatedDoc = {
            $set: {
              likes: Math.max(0, likes - 1),
              likesUsers: likesUsers.filter((u) => u !== user),
            },
          };
        } else {
          updatedDoc = {
            $set: {
              likes: likes + 1,
              likesUsers: [...likesUsers, user],
            },
          };
        }

        await myPostColl.updateOne({ _id: new ObjectId(postId) }, updatedDoc);

        res.status(200).json({
          success: true,
          message: hasLiked ? "Unliked" : "Liked",
          likes: hasLiked ? likes - 1 : likes + 1,
        });
      } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // ---------------------- TURFS ----------------------

    // Create Turf
    app.post("/turfs", async (req, res) => {
      try {
        const turfData = { ...req.body, bookings: [] }; // always initialize
        const result = await turfsCollection.insertOne(turfData);

        res.status(201).json({
          message: "Turf added successfully",
          turfId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding turf:", error);
        res.status(500).json({ message: "Failed to add turf" });
      }
    });

    // Get all turfs
    app.get("/turfs", async (req, res) => {
      try {
        const turfs = await turfsCollection.find().toArray();
        res.json(turfs);
      } catch (error) {
        console.error("Error fetching turfs:", error);
        res.status(500).json({ message: "Failed to fetch turfs" });
      }
    });

    // Book a turf slot

    app.post("/turfs/:id/book", async (req, res) => {
      const { id } = req.params;
      const { slot, user, date } = req.body;

      if (!slot || !user || !date) {
        return res
          .status(400)
          .json({ message: "Slot, user, and date are required" });
      }

      try {
        const turf = await turfsCollection.findOne({ _id: new ObjectId(id) });
        if (!turf) return res.status(404).json({ message: "Turf not found" });

        turf.bookings = turf.bookings || [];

        // Remove expired bookings automatically
        const now = new Date();
        turf.bookings = turf.bookings.filter((b) => {
          const endTime = new Date(`${b.date}T${b.end}:00`);
          return endTime > now;
        });

        // Prevent double-booking
        const alreadyBooked = turf.bookings.some(
          (b) => b.start === slot.start && b.end === slot.end && b.date === date
        );
        if (alreadyBooked) {
          return res.status(400).json({ message: "Slot already booked!" });
        }

        const newBooking = { ...slot, user, date, bookedAt: new Date() };
        turf.bookings.push(newBooking);

        await turfsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { bookings: turf.bookings } }
        );

        res.json({ message: "Slot booked successfully!", booking: newBooking });
      } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Error booking slot" });
      }
    });
    // Get all bookings for a specific user
    app.get("/user/bookings/:user", async (req, res) => {
      try {
        const { user } = req.params;
        const turfs = await turfsCollection.find().toArray();

        const today = new Date();

        const userBookings = turfs.flatMap((turf) =>
          (turf.bookings || [])
            .filter(
              (b) =>
                b.user === user && new Date(`${b.date}T${b.end}:00`) >= today
            )
            .map((b) => ({
              turfId: turf._id,
              turfName: turf.name,
              turfImage: turf.image,
              turfLocation: turf.location,
              turfPrice: turf.price,
              slot: { start: b.start, end: b.end },
              date: b.date,
            }))
        );

        res.json(userBookings);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch user bookings" });
      }
    });

    //delete booking
    app.delete("/turfs/:id/cancel", async (req, res) => {
      const { id } = req.params;
      const { slot, user, date } = req.body;

      if (!slot || !user || !date) {
        return res
          .status(400)
          .json({ message: "Slot, user, and date are required" });
      }

      try {
        const turf = await turfsCollection.findOne({ _id: new ObjectId(id) });
        if (!turf) return res.status(404).json({ message: "Turf not found" });

        turf.bookings = turf.bookings || [];

        console.log("🟨 Incoming cancel request:", { slot, user, date });
        console.log("🟩 Existing bookings:", turf.bookings);

        // Normalize user (handle both string or object with email)
        const userEmail =
          typeof user === "string"
            ? user.trim().toLowerCase()
            : user.email?.trim().toLowerCase();

        if (!userEmail) {
          return res.status(400).json({ message: "Invalid user format" });
        }

        const targetStart = slot.start?.trim();
        const targetEnd = slot.end?.trim();
        const targetDate = date.trim();

        const index = turf.bookings.findIndex((b) => {
          return (
            b.user?.trim().toLowerCase() === userEmail &&
            b.start?.trim() === targetStart &&
            b.end?.trim() === targetEnd &&
            b.date?.trim() === targetDate
          );
        });

        if (index === -1) {
          console.log("❌ No booking matched for:", {
            userEmail,
            targetDate,
            targetStart,
            targetEnd,
          });
          return res.status(404).json({ message: "Booking not found" });
        }

        // Remove that booking
        turf.bookings.splice(index, 1);

        await turfsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { bookings: turf.bookings } }
        );

        console.log("✅ Booking cancelled:", {
          userEmail,
          targetDate,
          targetStart,
          targetEnd,
        });
        res.json({ message: "Booking cancelled successfully" });
      } catch (error) {
        console.error("🚨 Error cancelling booking:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    // Get all players
    app.get("/players", async (req, res) => {
      try {
        const players = await playersCollection.find().toArray();
        res.json(players);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch players" });
      }
    });
    // POST /players
    app.post("/players", async (req, res) => {
      try {
        const { name, category, avatar } = req.body;

        if (!name || !category || !avatar) {
          return res
            .status(400)
            .json({ message: "Name, category and avatar are required" });
        }

        const newPlayer = {
          name,
          category,
          avatar,
          stats: {
            goals: 0,
            assists: 0,
            penalties: 0,
            fouls: 0,
            wins: 0,
            losses: 0,
          },
          experience: 0,
          matchesPlayed: 0,
          rank: 0, // percentage of wins
          createdAt: new Date(),
        };

        const result = await playersCollection.insertOne(newPlayer);
        res.status(201).json({ _id: result.insertedId, ...newPlayer });
      } catch (err) {
        console.error("Error adding player:", err);
        res.status(500).json({ message: "Failed to add player" });
      }
    });

    // In your server file (e.g., api/index.js or routes/bookings.js)
    app.get("/admin/bookings", async (req, res) => {
      try {
        const bookings = await bookingsCollection
          .find({})
          .sort({ date: -1 })
          .toArray();
        res.status(200).json(bookings);
      } catch (err) {
        console.error("Error fetching booking history:", err);
        res.status(500).json({ message: "Failed to fetch booking history" });
      }
    });

    app.patch("/admin/bookings/:id/cancel", async (req, res) => {
      try {
        const id = req.params.id;
        await bookingCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "Cancelled" } }
        );
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ message: "Failed to cancel booking" });
      }
    });

    //  POST — Create booking
    app.post("/bookings", async (req, res) => {
      try {
        const booking = req.body;
        booking.createdAt = new Date();

        const result = await bookingsCollection.insertOne(booking);
        res.status(201).json({ success: true, id: result.insertedId });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "Failed to create booking" });
      }
    });

    //  GET — Fetch all bookings (for admin later)
    app.get("/bookings", async (req, res) => {
      try {
        const bookings = await bookingsCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.json(bookings);
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch bookings" });
      }
    });

    // POST /matches - create a match
    app.post("/matches", async (req, res) => {
      try {
        const {
          teamA,
          teamB,
          teamSize,
          teamAName,
          teamBName,
          matchDate,
          matchTime,
          matchDuration,
        } = req.body;

        if (
          !teamA ||
          !teamB ||
          !teamSize ||
          !matchDate ||
          !matchTime ||
          !matchDuration
        ) {
          return res.status(400).json({
            message:
              "Team A, Team B, teamSize, matchDate, matchTime, and matchDuration are required",
          });
        }

        if (teamA.length !== teamSize || teamB.length !== teamSize) {
          return res.status(400).json({
            message: `Both teams must have exactly ${teamSize} players`,
          });
        }

        const matchDateTime = new Date(`${matchDate}T${matchTime}:00`);

        const newMatch = {
          teamA,
          teamB,
          teamAName: teamAName || "Team A",
          teamBName: teamBName || "Team B",
          teamSize,
          matchDate,
          matchTime,
          matchDuration,
          matchDateTime,
          createdAt: new Date(),

          isLive: false,
          isFinished: false,
        };

        const result = await matchesCollection.insertOne(newMatch);
        res.status(201).json({ _id: result.insertedId, ...newMatch });
      } catch (err) {
        console.error("Error creating match:", err);
        res.status(500).json({ message: "Failed to create match" });
      }
    });
    // GET /matches
    app.get("/matches", async (req, res) => {
      try {
        const matches = await matchesCollection.find().toArray();
        res.json(matches);
      } catch (err) {
        console.error("Error fetching matches:", err);
        res.status(500).json({ message: "Failed to fetch matches" });
      }
    });

    app.patch("/matches/start/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const now = new Date();

        const result = await matchesCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              isLive: true,
              matchDateTime: now,
            },
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Match not found" });
        }

        res.json({ message: "Match started", success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to start match" });
      }
    });
    app.patch("/matches/:id/end", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await matchesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { isLive: false, isFinished: true } }
        );

        res.json({ message: "Match ended", success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to end match" });
      }
    });
    // Ping test
    // await client.db("admin").command({ ping: 1 });
    // console.log("✅ MongoDB connected!");
  } finally {
  }
}

run().catch(console.dir);

// Start server
// mongoose
//   .connect(uri)
//   .then(() => {

//   })
//   .catch((err) => console.error("MongoDB connection error:", err));

// module.exports = app;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
