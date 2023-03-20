import fs from "fs";
import express from "express";
import bodyParser from "body-parser";

const PORT = 2000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let filteredResult = JSON.parse(fs.readFileSync("./data/expense.json"));
console.log(filteredResult);

app.get("/:id", (req, res) => {
  const result = filteredResult.filter((item) => req.params.id == item.id);
  //   console.log(req.params.id);
  res.status(200).send(result);
});

app.get("/", (req, res) => {
  const requestQuery = Object.keys(req.query);

  if (!requestQuery.length) {
    res.status(200).send(filteredResult);
  } else if (requestQuery.includes("category")) {
    res
      .status(200)
      .send(
        filteredResult.filter((data) => data.category == req.query.category)
      );
  } else if (
    requestQuery.includes("date-start") &&
    requestQuery.includes("date-end")
  ) {
    const dateStart = new Date(req.query["date-start"]);
    const dateEnd = new Date(req.query["date-end"]);
    res
      .status(200)
      .send(
        filteredResult.filter(
          (data) =>
            new Date(data.date) >= dateStart && new Date(data.date) <= dateEnd
        )
      );
  }
  //   console.log(req.query);
  res.status(200).send(filteredResult);
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

app.patch("/:id", (req, res) => {
  const indexAt = filteredResult.findIndex((data) => data.id == req.params.id);

  filteredResult[indexAt] = { ...filteredResult[indexAt], ...req.body };

  fs.writeFileSync("./data/expense.json", JSON.stringify(filteredResult));

  res.status(200).send("Data Updated");
});

app.listen(PORT, () => console.log("Server running :", PORT));
