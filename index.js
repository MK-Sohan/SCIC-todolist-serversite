const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ObjectID,
} = require("mongodb");

require("dotenv").config();
const cors = require("cors");
const { query } = require("express");
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
    app.put("/completetodo/:id", async (req, res) => {
      const id = req.params.id;

      const value = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: value,
      };
      const result = await comPletetoDolistCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const deletetodo = await toDolistCollection.deleteOne(filter);
      res.send({ result, deletetodo });
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
      const filter = { _id: ObjectId(id) };
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
    app.delete("/removetodo/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectId(id) };
      const result = await toDolistCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/removeCompletetodo/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await comPletetoDolistCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/singleTodo/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectId(id) };
      const result = await toDolistCollection.findOne(query);
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
