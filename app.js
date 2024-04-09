const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const Food = require('./Model/Food')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/foods", async (req, res) => {
    const foods = await Food.find();
    res.json(foods);
});

app.get("/api/foods/:id", async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.json(food);
});


app.post("/api/foods", async (req, res) => {
    const { name, category, quantity, expirationDate, price } = req.body;
    const food = new Food({
        name,
        category,
        quantity,
        expirationDate,
        price
    });

    await food.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
            console.log(err);
        });
});

app.put("/api/foods/:id", async (req, res) => {
    const { name, category, quantity, expirationDate, price } = req.body;
    const updatedFood = await Food.findByIdAndUpdate(
        req.params.id,
        { $set: { name, category, quantity, expirationDate, price } },
        { new: true }
    );
    res.json(updatedFood);
});

app.delete("/api/foods/:id", async (req, res) => {
    const removedFood = await Food.findByIdAndDelete(req.params.id);
    res.json(removedFood);
});


mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log('Connected to DataBase');
    })
    
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });
