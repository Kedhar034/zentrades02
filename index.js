const express = require('express');
const axios = require('axios');
const app = express();
const https=require("https")
const PORT = process.env.PORT || 3000;
const APIurl = "https://s3.amazonaws.com/open-to-cors/assignment.json"
const path = require("path")

app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ProductData = async () => {
    return new Promise((resolve, reject) => {
        https.get(APIurl, (res) => {
            let data = '';
            res.on('data', (ref) => { data =data+ ref });


            res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData.products);
            } catch (err) {
                reject(err);
            };
            });
        });
    });
  };
  
const sortByPopularity = (products) => {
    return Object.values(products).sort((a, b) => b.popularity - a.popularity);
};

app.get("/", async (req, res) => {
    try {
        const products = await ProductData();
        const sortedProducts = sortByPopularity(products);
        res.render("index",{products:sortedProducts});

    }catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => console.log("Server is running"));