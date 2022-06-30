const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zuzwn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const toDolistCollection = client.db("all-todolist").collection("to-do");
    const comPletetoDolistCollection = client
      .db("all-todolist")
      .collection("checked-todo");
    app.post("/postTodo", async (req, res) => {
      const toDo = req.body;

      const result = await toDolistCollection.insertOne(toDo);

      res.send(result);
    });
    app.post("/completetodo", async (req, res) => {
      const value = req.body;

      const result = await comPletetoDolistCollection.insertOne(value);

      res.send(result);
    });
    app.get("/completedTasks", async (req, res) => {
      const result = await comPletetoDolistCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/todoList", async (req, res) => {
      const result = await toDolistCollection.find({}).toArray();
      res.send(result);
    });

    app.put("/updatetodo/:id", async (req, res) => {
      const id = req.params.id;
      const info = req.body;
      const filter = { _id: "id" };
      const options = { upsert: true };
      const updateDoc = {
        $set: info,
      };
      const result = await toDolistCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My to do list is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});