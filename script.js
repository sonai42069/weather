
const app =document.querySelector('.weather-app');

    const temp = document.querySelector('.temp');
    
    const feelslike = document.querySelector('.feels-like');
    
    const dateOutput = document.querySelector('.date');
    
    const timeOutput = document.querySelector('.time');
    
    const conditionOutput = document.querySelector('.condition');
    
    const nameOutput = document.querySelector('.name');
    
    const icon = document.querySelector('.icon');
    
    const cloudOutput = document.querySelector('.cloud');
    
    
    const humidityOutput = document.querySelector('.humidity');
    
    const windOutput =document.querySelector('.wind');
    
    const form = document.getElementById('locationInput'); 
    
    const search =document.querySelector('.search');
    
    const btn = document.querySelector('.submit');
    
    const cities = document.querySelectorAll('.city');

getAutoLoction();
function getLocations (position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
   

    console.log(position);
    fetchWeatherData(null, lat ,long);
}
function error()
{
    console.log('Some Error');
}
function getAutoLoction(){
    navigator.geolocation.getCurrentPosition(getLocations, error);
    }
        
    //Default city when the page Loads let cityInput = "London";
    let cityInput = "";
    //Add click event to each city in the panel
    
    cities.forEach((city) => {
    
        city.addEventListener('click', (e) => {
            cityInput = e.target.innerHTML;
            fetchWeatherData(cityInput,null,null);
            app.style.opacity ="0";
        });
    })
    form.addEventListener('submit',(e) => {
        if(search.value.length == 0)
        {
            alert("Please type a city name");
        }else{
            cityInput = search.value;
            fetchWeatherData(cityInput,null,null);
            search.value ="";
            app.style.opacity ="0";
        }
        e.preventDefault();
    });
    
    
    function dayOfTheWeek(day, month, year) {
    
        const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",   
        "Friday", 
        "Saturday"  
        ];   
        return weekday[new Date('$(day}/${month}/$(year)').getDay()];
     }
    
     function fetchWeatherData(cityInput,lat,long) {
        
        const apiKey = '68868b955e28492985c132915240109'; // Replace with your actual API key
        let url;
        if (lat !== null && long !== null) {
            url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${long}&aqi=no`;

        }else if(cityInput){
         url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}&aqi=no`;
        }else {
            alert(' City not found Please Try again');
        }
        
        fetch(url).then(response => response.json()).then(data => {
            console.log(data)
            temp.innerHTML = parseInt(data.current.temp_c) + "&#176;";
            feelslike.innerHTML = "Feels Like :  " + data.current.feelslike_c  + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;
            const date = data.location.localtime;
            const y =parseInt(date.substring(0, 4));
            const m =parseInt(date.substring(5, 7));
            const d =parseInt(date.substring(8, 10));
            const time=date.substring(11);
            dateOutput.innerHTML ="      " +d+"/"+m+"/"+y;
           /*  //dateOutput.innerHTML = '${dayOfTheWeek(d ,m, y)} ${d}, ${m}, ${y}'; 
            let result = dayOfTheWeek(d, m, y);
            console.log(result);
            dateOutput.innerHTML = result + " " + d + ", " + m + ", " + y;
            //dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`; */
            timeOutput.innerHTML = time+"    ";
            nameOutput.innerHTML = data.location.name;
            /* const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
            icon.src ="./icon/"+iconId; */
            icon.src =data.current.condition.icon;
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";
            let timeOfDay = "day";
            const code = data.current.condition.code;
            if(data.current.is_day == 0) {
                timeOfDay="night";
            }
            if(code == 1000)
            {
                app.style.backgroundImage = `url('./images/${timeOfDay}/clear.jpg')`;
                btn.style.background = "#e5ba92";
                if(timeOfDay == "night")
                {
                    btn.style.background ="#181e27";
                }
            } else if(code==1003 || code==1006 || code==1009 || code==1030 || code==1069 || code==1087 || code==1135 || code==1273 || code==1276  || code==1279 || code==1282){
                app.style.backgroundImage = `url('./images/${timeOfDay}/cloudy.jpg')`;
    
                btn.style.background = "#fa6d1b";
                if(timeOfDay == "night")
                    {
                        btn.style.background ="#181e27";
                    }
            } else if(code==1063 || code==1069 || code==1072 || code==1150 || code==1153 || code==1180 || code==1183 || code==1186 || code==1189  || code==1192 || code==1195 || code==1204 || code==1207 || code==1240 || code==1243 || code==1246  || code==1249 || code==1252){
                app.style.backgroundImage = `url('./images/${timeOfDay}/rainy.jpg')`;
                btn.style.background = "#647d75";
                if(timeOfDay == "night")
                    {
                        btn.style.background ="#325c80";
                    }
            }else{
                app.style.backgroundImage = "url('./images/${timeOfDay}/snowy.jpg')";
                btn.style.background = "#4d72aa";
                if(timeOfDay == "night")
                    {
                        btn.style.background ="#1b1b1b";
                    }
            }
            app.style.opacity ="1";
    
    
    
        })
        .catch(() => {
            alert(" City not found Please Try again");
            app.style.opacity ="1";    
        });
    // const apiKey = '285e525ca5e38435d1f5222719b51f1d';
     }
    
     
    
     app.style.opacity ="1"; 
    
