
import axios from "axios";

const input_date = document.querySelector("#travelDate");
const input_city = document.querySelector("#cityLOC");   
const exp_city = document.querySelector("#errorCity");
const myForm = document.querySelector("form");
const date_error = document.querySelector("#errIn_data");

//here to get remmaining days 
const remdays = (the_date) => {
  const firstdate = new Date();
  const lastdate = new Date(the_date);

  const exp_time = lastdate.getTime() - firstdate.getTime();

  const exp_days = Math.ceil(exp_time / (1000 * 3600 * 24));
  return exp_days;
};


//to get city location information
const fetch_city_location = async () => {
  if (input_city.value) {
    const { data } = await axios.post("http://localhost:8000/fetchCityLocation", myForm, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } else {
    exp_city.innerHTML = `fill the blank`;
    exp_city.style.display = "block";
  }
};

const fetch_city_weathers = async (lng, lat, days_rem) => {
  const { data } = await axios.post("http://localhost:8000/fetchweather", {
    lng,
    lat,
    days_rem,
  });

  return data;
};

const validate_inputs = () => {
  exp_city.style.display = "none";
  date_error.style.display = "none";
  if(input_city.value==0){
    exp_city.innerHTML = `Enter the city`;
    exp_city.style.display = "block";
    return;
  }
  if(input_date.value==0){
    date_error.innerHTML = `Enter the date`;
    date_error.style.display = "block";
    return;
  }
  if(remdays(input_date.value) < 0){
    date_error.innerHTML = `enter coming date`;
    date_error.style.display = "block";
    return;
  }
  exp_city.style.display = "none";
  date_error.style.display = "none";

  return true
};

const submithandelling  = async (a) => {
  a.preventDefault();

  console.log("running event");

  if(validate_inputs()==0){
    return;
  };
  const valid_location = await fetch_city_location();
  if (valid_location && valid_location.error) {
    exp_city.innerHTML = `${valid_location.message}`;
    exp_city.style.display = "block";
    return
  } else if (valid_location && !valid_location.error) {
    const { lng, lat, name } = await valid_location;

    const date = input_date.value;

    if (!date) {
      console.log("Enter the date");
      date_error.innerHTML = `Enter the date`;
      date_error.style.display = "block";
      return;
    }
    if (lng && lat) {
      const days_rem = remdays(date);

      const weather_rate = await fetch_city_weathers(lng, lat, days_rem);
      if(weather_rate && weather_rate.error) {
       
        date_error.innerHTML = `${weather_rate.message}`;
       
        date_error.style.display = "block";
        return;
      }
      const pic = await fetch_city_picture(name);
      updateUI(days_rem, name, pic, weather_rate);
    }
  }
};

const updateUI = (remainigDays, theCity, picture, cityWeather) => {
  document.querySelector("#remainigDays").innerHTML = `
  Your journey begins in ${remainigDays} days `;
  document.querySelector(".nameoftheCity").innerHTML = `Location: ${theCity}`;
  document.querySelector(".cityWeather").innerHTML =
  remainigDays > 7
      ? `The Weather is: ${cityWeather.description}`
      : `Weather is expected to be: ${cityWeather.description}`;
  document.querySelector(".temp").innerHTML =
  remainigDays > 7
      ? `Projected: ${cityWeather.temp}&degC`
      : `Temperature: ${cityWeather.temp} &deg C`;
  document.querySelector(".maximum-tempreture").innerHTML =
  remainigDays > 7 ? `Maximum Tempreture: ${cityWeather.app_max_temp}&degC` : "";
  document.querySelector(".minimum-tempreture").innerHTML =
  remainigDays > 7 ? `Minimum Tempreture: ${cityWeather.app_min_temp}&degC` : "";
  document.querySelector(".cityPicture").innerHTML = `
   <image 
   src="${picture}" 
   alt="Image of the city"
>`;
  document.querySelector(".destination-info").style.display = "block";
};


const fetch_city_picture = async (city_name) => {
  const { data } = await axios.post("http://localhost:8000/fetchCityPIC", {
    city_name,
  });
  const { image } = await data;
  return image;
};



export { submithandelling  };