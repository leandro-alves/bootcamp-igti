import express from "express";
import { promises, read, write } from "fs";

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post("/", async (req, res) => {
    let grade = req.body;
    try {
        let data = await readFile(global.fileGrades, "utf8");
        let json = JSON.parse(data);

        grade = { id: json.nextId++, ...grade };
        grade.timestamp = new Date();
        json.grades.push(grade);

        await writeFile(global.fileGrades, JSON.stringify(json));

        res.send(JSON.stringify(grade));
    } catch (error) {
        console.log(error.message);
    }
});

router.get("/", async (_, res) => {
    try {
        let data = await readFile(global.fileGrades, "utf8");
        let json = JSON.parse(data);
        delete json.nextId;
        res.send(json);
    } catch (error) {
        console.log(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        let data = await readFile(global.fileGrades, "utf8");
        let json = JSON.parse(data);
        const grade = json.grades.filter(grade => grade.id === parseInt(req.params.id, 10));

        if (grade) {
            res.send(grade);
        } else {
            res.end();
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put("/", async (req, res) => {
    try {
        let newGrade = req.body;
        let data = await readFile(global.fileGrades, "utf8");
        let json = JSON.parse(data);
        let oldIndex = json.grades.findIndex(grade => grade.id === newGrade.id);

        if (oldIndex < 0) {
            throw new Error("Não existe grade com o id informado")
        }

        json.grades[oldIndex].student = newGrade.student;
        json.grades[oldIndex].subject = newGrade.subject;
        json.grades[oldIndex].type = newGrade.type;
        json.grades[oldIndex].value = newGrade.value;

        await writeFile(global.fileGrades, JSON.stringify(json));

        res.send(JSON.stringify(newGrade));
    } catch (error) {
        console.log(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let data = await readFile(global.fileGrades, "utf8");
        let json = JSON.parse(data);
        let grades = json.grades.filter(grade => grade.id !== parseInt(req.params.id, 10));
        json.grades = grades;

        await writeFile(global.fileGrades, JSON.stringify(json));

        res.end();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/nota-total", async (req, res) => {
    try {
        let params = req.body;
        let data = await readFile(global.fileGrades, "utf8");
        let json = JSON.parse(data);

        const filteredGrades = json.grades.filter(grade =>
            (grade.student.toLowerCase().indexOf(params.student.toLowerCase()) > -1 &&
                (grade.subject.toLowerCase().indexOf(params.subject.toLowerCase())) > -1));

        const totalGrade = filteredGrades.reduce((accumulator, current) => {
            return accumulator + current.value;
        }, 0);

        res.send(`Nota total: ${totalGrade}`);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/average", async (req, res) => {
    let params = req.body;
    let data = await readFile(global.fileGrades, "utf8");
    let json = JSON.parse(data);

    const filteredGrades = json.grades.filter(grade =>
        (grade.subject.toLowerCase().indexOf(params.subject.toLowerCase()) > -1 &&
            (grade.type.toLowerCase().indexOf(params.type.toLowerCase())) > -1));

    const totalGrade = filteredGrades.reduce((accumulator, current) => {
        return accumulator + current.value;
    }, 0);

    const averageGrade = (totalGrade / filteredGrades.length).toFixed(2);

    res.send(`Média das notas: ${averageGrade}`);
});

router.post("/top-three", async (req, res) => {
    let params = req.body;
    let data = await readFile(global.fileGrades, "utf8");
    let json = JSON.parse(data);
    let topThree = [];

    const filteredGrades = json.grades
    .filter(grade =>
        (grade.subject.toLowerCase().indexOf(params.subject.toLowerCase()) > -1 &&
        (grade.type.toLowerCase().indexOf(params.type.toLowerCase())) > -1))
    .sort((a,b) => b.value - a.value);

    for (let i = 0; i < 3; i++) {
        topThree.push(filteredGrades[i]);
    }

    res.send(JSON.stringify(topThree));
});

export default router;