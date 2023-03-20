import fs from "fs";
import express from "express";
import bodyParser from "body-parser";

const PORT = 2000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log("Server running :", PORT));
