const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

let db, collection;

const url = "mongodb+srv://judychong:sp00kymuld3r@cluster0.dnbqu.mongodb.net/toDoDb?retryWrites=true&w=majority";
const dbName = "toDoDb";

app.listen(4000, () => {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      db = client.db(dbName);
      console.log("Connected to `" + dbName + "`!");
    }
  );
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); //This takes files in the public folder and lets express handle it automatically.

app.get("/", (req, res) => {
  db.collection("todos")
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render("index.ejs", { todos: result.reverse() });
    });
});

app.post("/todos", (req, res) => {
  //stop empty list items from being sent
  if (req.body.item === "") {
    return;
  } else {
    db.collection("todos").insertOne(
      { item: req.body.item, checkedOff: req.body.checkedOff },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/");
      }
    );
  }
});

//add checkedOff:yes to document
app.put("/crossedOut", (req, res) => {
  db.collection("todos").findOneAndUpdate(
    { item: req.body.item, checkedOff: req.body.checkedOff },
    {
      $set: {
        checkedOff: "yes",
      },
    },
    {
      sort: { _id: -1 }, //Sorts documents in db ascending (1) or descending (-1)
      upsert: true,
    },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

//add checkedOff:no to document
app.put("/notCrossedOut", (req, res) => {
  db.collection("todos").findOneAndUpdate(
    { item: req.body.item, checkedOff: req.body.checkedOff },
    {
      $set: {
        checkedOff: "no",
      },
    },
    {
      sort: { _id: -1 }, //Sorts documents in db ascending (1) or descending (-1)
      upsert: true,
    },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});


app.delete("/deleteCrossedOut", (req, res) => {
  console.log(req.body.checkedOff);
  db.collection("todos").deleteMany(
    { checkedOff: req.body.checkedOff },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send("Message deleted!");
    }
  );
});

//passing {} deletes all documents
app.delete("/deleteAll", (req, res) => {
  db.collection("todos").deleteMany({}, (err, result) => {
    if (err) return res.send(500, err);
    res.send("Message deleted!");
  });
});
