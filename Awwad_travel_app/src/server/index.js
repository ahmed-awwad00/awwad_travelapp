const express = require("express");
const cors = require("cors");
const { fetchCityLocation, fetchCityPIC, fetchWeather } = require("./fetchCityInfo"); 
require('dotenv').config();

const app = express();
const port_number = 8000;

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

const username = process.env.GEONAMES_USERNAME;
const number_ofuserAccount = process.env.number_ofuserAccount;
const key_of_weather = process.env.key_of_weather;
const key_ofPixsite = process.env.key_ofPixsite;
const ready_username = username.concat(number_ofuserAccount);

console.log(ready_username);

app.get("/", (req, res) => {
    res.render("index.html");
});

app.post("/fetchCityLocation", async (req, res) => {
    try {
        const the_city = req.body.city;
        if (!the_city) {
            return res.status(400).send({ error: "City is required" });
        }
        const city_location = await fetchCityLocation(the_city, ready_username);
        return res.send(city_location);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

app.post("/fetchCityPIC", async (req, res) => {
    try {
        const { city_name } = req.body;
        const fetch_city_picture = await fetchCityPIC(city_name, key_ofPixsite);
        return res.send(fetch_city_picture);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

app.post("/fetchweather", async (req, res) => {
    try {
        const { lng, lat, days_rem } = req.body;
        const fetchweather = await fetchWeather(lng, lat, days_rem, key_of_weather);
        return res.send(fetchweather);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

app.listen(port_number, () => console.log(`Server is listening on port ${port_number}`));
