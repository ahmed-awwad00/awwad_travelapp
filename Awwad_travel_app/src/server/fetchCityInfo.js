

const axios = require("axios");

// Function to get city location from GeoNames
const fetchCityLocation = async (city, username) => {
    try {
        const response = await axios.get(`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`);
        const cityData = response.data.geonames;

        if (!cityData || cityData.length === 0) {
            return { error: true, message: "City not found" };
        }
        return cityData[0];
    } catch (error) {
        console.error("Error fetching city location:", error.message);
        return { error: true, message: "Failed to get city location" };
    }
};

// Function to get city image from Pixabay
const fetchCityPIC = async (city, apiKey) => {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${city}&image_type=photo`);
        const image = response.data.hits.length > 0 ? response.data.hits[0].webformatURL : "https://source.unsplash.com/random/640x480?city";
        return { image };
    } catch (error) {
        console.error("Error fetching city image:", error.message);
        return { error: true, message: "Failed to get city image" };
    }
};

// Function to get weather data from Weatherbit
const fetchWeather = async(p1, p2, remainigDays, key) => {
    if(remainigDays < 0) {
            const messageError = {
                message: "Please Enter upcoming date",
                error: true
            }
            return messageError
        }
        const {data} = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${p2}&lon=${p1}&units=M&days=${remainigDays}&key=${key}`)
       
        const {weather , temp, app_max_temp, app_min_temp} = data.data[data.data.length -1];
       
        const {description} = weather;
       
        const city_WeatherData = {description, temp, app_max_temp, app_min_temp}
        return city_WeatherData
    

}




// Export the utility functions
module.exports = {
    fetchCityLocation,
    fetchCityPIC,
    fetchWeather
};

