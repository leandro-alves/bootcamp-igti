import express from 'express';
import mongoose from 'mongoose';

import { studentRouter } from './routes/studentRouter.js';

(async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://dbLeandrinho:dbLeandrinho@bootcampigti-gydz3.mongodb.net/grades?retryWrites=true&w=majority', 
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }
        );          
    } catch (error) {
        console.log('Erro ao conectar no MongoDB');        
    }
})();

const app = express();

app.use(express.json());
app.use(studentRouter);

app.listen(3000, () => {
    console.log('API iniciada');
});

