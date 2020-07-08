import express from "express";
import {promises} from "fs";
import gradesRouter from "./routes/grades.js";

const app = express();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

global.fileGrades = "grades.json";

app.use(express.json());
app.use("/grades", gradesRouter);
app.listen(3000, () => {
    console.log("API started!");
})