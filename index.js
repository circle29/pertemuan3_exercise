import fs from "fs";
import express from "express";
import bodyParser from "body-parser";

const PORT = 2000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let filteredResult = JSON.parse(fs.readFileSync("./data/expense.json"));
console.log(filteredResult);

app.get("/", (req, res) => {
  res.status(200).send(filteredResult);
});

app.get("/:id", (req, res) => {
  const result = filteredResult.filter((item) => req.params.id == item.id);
  //   console.log(req.params.id);
  res.status(200).send(result);
});

app.post("/", (req, res) => {
  let incrementID = filteredResult[filteredResult.length - 1].id + 1;
  filteredResult.push({ id: incrementID, ...req.body });
  fs.writeFileSync("./data/expense.json", JSON.stringify(filteredResult));
  res.status(200).send("Data Added Success");
});

app.delete("/:id", (req, res) => {
  const result = filteredResult.filter((item) => req.params.id != item.id);
  fs.writeFileSync("./data/expense.json", JSON.stringify(result));

  res.status(200).send(`ID ${req.params.id} Deleted`);
});

app.listen(PORT, () => console.log("Server running :", PORT));
