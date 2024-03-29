import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Todolist",
  password: "database16",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM list ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "TO_DO_LIST",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    await db.query("INSERT INTO list (list_items) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const id=req.body.updatedItemId;
  const item=req.body.updatedItemTitle;
  try{
 await db.query("UPDATE list SET list_items=($1) WHERE id=$2 ",[item,id]);
 res.redirect("/");
} catch (err) {
  console.log(err);
}
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM list WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
