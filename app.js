const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");


const app = express();
// .................................................variables.........................................
var lat; var lon; var temp; var desp; var wind; var pressure; var sunset;
var humidity; var icon; var deg; var W_unit; var city_name;
var Date_array =[];
var Temp_array=[];
var Weather_array=[];

// ...........................................ende of variables..........................................

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'))


app.set("view engine",'ejs');

//..............................................home route GET............................................
app.get("/",function(req,res){;
    res.render("index");
});


//..................................ROUTE WITH PARAMS......................................................

app.get("/:cityname",function(req,res){;
    city_name = req.params.cityname;
    console.log(city_name);
    const unit ="metric";
    const api_key="695784529c13eb2958fd98f81c88fefb";   
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+ city_name +"&appid="+ api_key +"&units="+unit;
    console.log(url);
    
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            var wetherdata = JSON.parse(data);
            try{
                desp = wetherdata.weather[0].description;
                temp = Math.floor(wetherdata.main.temp);
                wind = Math.floor(wetherdata.wind.speed);
                pressure = wetherdata.main.pressure;
                humidity = wetherdata.main.humidity;
                icon = wetherdata.weather[0].main;
                lon = wetherdata.coord.lon;
                lat = wetherdata.coord.lat;
                deg="C";
                W_unit="Km/h"
                console.log(desp, temp, wind, pressure, icon, city_name, Temp_array, Date_array, Weather_array);
                
                //..............................................FORECASTING API DATA ............................................
            
                const url_f ="https://api.openweathermap.org/data/2.5/forecast?q="+city_name+"&appid=695784529c13eb2958fd98f81c88fefb&units="+unit;
                https.get(url_f,function(response){
                    response.on("data",function(data){
                        var d = JSON.parse(data);
                        var data_list = d.list;
                        Date_array=[];
                        Temp_array=[];
                        Weather_array=[];
                        for(var i=0;i<40;i++){
                            utcString = new Date(data_list[i].dt * 1000).toUTCString();
                            Date_array.push(utcString.slice(0,3));
                            Temp_array.push(Math.floor(data_list[i].main.temp));
                            Weather_array.push("http://openweathermap.org/img/wn/"+data_list[i].weather[0].icon+".png");
                        }
                        res.render("data",{T_status:Temp_array,W_status:Weather_array,Day:Date_array,W_unit:W_unit,deg:deg,lon:lon,lat:lat,icon_data:icon ,temp:temp,city_name:city_name,wind:wind,Pres:pressure,sunS:sunset,humid:humidity,status:desp});
                    });
                    
                });
            // console.log(Date_array);
            // console.log(Temp_array);
            // console.log(Weather_array);
            }catch(err){
               var mess = wetherdata.message;
               console.log(mess);
                 res.render("error_page",{message:mess});
               
            }  
    });
});

});



//..............................................WEATHER API DATA POST............................................

app.post("/",function(req,res){
    const unit ="metric";
    const api_key="695784529c13eb2958fd98f81c88fefb";
    city_name = req.body.city;
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+ city_name +"&appid="+ api_key +"&units="+unit;
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            var wetherdata = JSON.parse(data);
            try{
                desp = wetherdata.weather[0].description;
                temp = Math.floor(wetherdata.main.temp);
                wind = Math.floor(wetherdata.wind.speed);
                pressure=wetherdata.main.pressure;
                sunset = wetherdata.sys.sunset;
                humidity = wetherdata.main.humidity;
                icon = wetherdata.weather[0].main;
                lon = wetherdata.coord.lon;
                lat = wetherdata.coord.lat;
                deg="C";
                W_unit="Km/h"
                console.log(desp, temp, wind, pressure,city_name, sunset, icon, Temp_array, Date_array, Weather_array);
                
                //..............................................FORECASTING API DATA ............................................
            
                const url_f ="https://api.openweathermap.org/data/2.5/forecast?q="+city_name+"&appid=695784529c13eb2958fd98f81c88fefb&units="+unit;
                https.get(url_f,function(response){
                    response.on("data",function(data){
                        var d = JSON.parse(data);
                        var data_list = d.list;
                        Date_array=[];
                        Temp_array=[];
                        Weather_array=[];
                        for(var i=0;i<40;i++){
                            utcString = new Date(data_list[i].dt * 1000).toUTCString();
                            Date_array.push(utcString.slice(0,3));
                            Temp_array.push(Math.floor(data_list[i].main.temp));
                            Weather_array.push("http://openweathermap.org/img/wn/"+data_list[i].weather[0].icon+".png");
                        }
                        res.render("data",{T_status:Temp_array,W_status:Weather_array,Day:Date_array,W_unit:W_unit,deg:deg,lon:lon,lat:lat,icon_data:icon ,temp:temp,city_name:city_name,wind:wind,Pres:pressure,sunS:sunset,humid:humidity,status:desp});
                    });
                    
                });
            // console.log(Date_array);
            // console.log(Temp_array);
            // console.log(Weather_array);
            }catch(err){
               var mess = wetherdata.message;
               console.log(mess);
                 res.render("error_page",{message:mess});
               
            }  
    });
});





});
//..............................................DEGREE ROUTE C TO K POST ............................................

app.post("/degree", function(req,res){
    const value = req.body.Cel;
    if(value=='F'){
        console.log(temp);
        deg="F";
        W_unit="mph";
        var kel = Math.floor((temp *1.8)+32);
        console.log(kel);
        var speed = Math.floor(wind*0.6213711922);
        console.log(speed);
        res.render("data",{T_status:Temp_array,W_status:Weather_array,Day:Date_array,W_unit:W_unit,deg:deg,lon:lon,lat:lat,icon_data:icon ,temp:kel,city_name:city_name,wind:speed,Pres:pressure,sunS:sunset,humid:humidity,status:desp});
    }
    else{
        deg="C";
        W_unit="km/h";
        res.render("data",{T_status:Temp_array,W_status:Weather_array,Day:Date_array,W_unit:W_unit,deg:deg,lon:lon,lat:lat,icon_data:icon ,temp:temp,city_name:city_name,wind:wind,Pres:pressure,sunS:sunset,humid:humidity,status:desp});

    }
    
});
app.listen(process.env.PORT||3000);