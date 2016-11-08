//将原始json数据转化为wxml需要的数据
function weatherDataAdapter(originalData) {
    var topWeatherForecast = [];
    var bottomWeatherForecast = [];
    originalData.weather.forEach(function(element, index, array){
        var day = "";
        if(index == 0) {
            day = "今天";
        } else {
            day = '周' + element.week;
        }
        var date = element.date.substring(5,7) + '/' + element.date.substring(8,10);
        var description = element.info.day[1];
        var imageSrc = weatherIconMap(element.info.day[0], false);
        console.log(imageSrc);
        topWeatherForecast.push({
            day:day,
            date:date,
            description:description,
            imageSrc:imageSrc
        });

        var nightDescription = element.info.day[1];
        var nightImageSrc = weatherIconMap(element.info.day[0],true);
        var wind = element.info.day[3];
        if (wind === "") {
            wind = "风";
        }
        var windLevel = element.info.day[4];
        bottomWeatherForecast.push({
            nightDescription:nightDescription,
            nightImageSrc:nightImageSrc,
            wind:wind,
            windLevel:windLevel
        });
    });
    return {
            city:originalData.realtime.city_name,
            weatherDescription:originalData.realtime.weather.info,
            temperature:originalData.realtime.weather.temperature,
            topWeatherForecast:topWeatherForecast,
            bottomWeatherForecast:bottomWeatherForecast
          }
}

function temperatureDataAdapter(originalData){
    var dayTemperature = [];
    var nightTemperature = [];
    originalData.weather.forEach(function(element, index, array){
        dayTemperature.push(Number(element.info.day[2]));
        nightTemperature.push(Number(element.info.night[2]));
    });
    return {
        dayTemperature:dayTemperature,
        nightTemperature:nightTemperature
    }
}
//根据天气类型和是否是夜晚 映射成图片地址
function weatherIconMap(type,isNight) {
    var host = "../../image/";
    var typeNumber = Number(type);
    var fileName;
    if (typeNumber >=0 && typeNumber <= 9){
        if(typeNumber == 0 && isNight == true){
            fileName = "w30.png";
        }else if(typeNumber == 1 && isNight == true){
            fileName = "w31.png";
        }else if(typeNumber == 3 && isNight == true){
            fileName = "w33.png";
        }else{
            fileName = "w"+ typeNumber+".png";
        }
    } else if (typeNumber >=10 && typeNumber <= 12){
        fileName = "w10.png";
    } else if(typeNumber == 13){
        if (isNight == true){
            fileName = "w13.png";
        } else {
            fileName = "w34.png";
        }  
    } else if(typeNumber == 18){
        if (isNight == true){
            fileName = "w18.png";
        } else {
            fileName = "w32.png";
        }  
    } else if (typeNumber >=21 && typeNumber <= 25){
        var newTypeNumber = typeNumber-13;
        fileName = "w"+ newTypeNumber+".png";
    } else if (typeNumber >=26 && typeNumber <= 28){
        var newTypeNumber = typeNumber-11;
        fileName = "w"+ newTypeNumber+".png";
    } else if (typeNumber == 29) {
        if (isNight == true){
            fileName = "w29.png";
        } else {
            fileName = "w35.png";
        }
    } else if (typeNumber ==30 && typeNumber <= 31){
        fileName = "w36.png";
    } else if (typeNumber == 53){
        fileName = "w46.png";
    } else {
        fileName = "w44.png";
    }
    return host+fileName;
}
module.exports.weather = {
    weatherDataAdapter:weatherDataAdapter,
    temperatureDataAdapter:temperatureDataAdapter
}
    
