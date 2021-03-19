var searchBtn = $('#search')
var cityDates=  $('.dates')
var cityTemp = $('.temp')
var cityHum = $('.hum')
var cityNames = $('#location')
var cityMainTemp = $('#mainTemp')
var cityHumid = $('#humidity')
var cityWind = $('#wind')
var cityUV = $('#uvIndex')
var cityStorage = $('#cityName')
var searchHist = $('.searchHistory')
var cityCloud = $('.cloud')
var cityEmo = $('#emoji')
var histBtn = $('.history')
var storage = []

function renderText() {

    for (i = 0; i < cityDates.length; i++) {
        var time = moment().add(i+1, 'days').format('l')
        $(cityDates[i]).text(time)
    }
    if (localStorage.getItem('search') != null) {
        var storageData = JSON.parse(localStorage.getItem('search'))

        fetch("https://api.openweathermap.org/data/2.5/forecast?q="+ storageData[storageData.length-1] +"&units=imperial&appid=fdb0a3a60be763cc57b205caf5a7d419")
            .then(function(response) {
                console.log(response.status)
                if (response.status === 404) {
                    cityNames.text("404 Error: City not found")
                } else {
                    return response.json()
                }
                
            })
            .then(function(data) {
                cityNames.text(storageData[storageData.length-1]);
                cityMainTemp.text(data.list[0].main.temp)
                cityHumid.text(data.list[0].main.humidity + '%')
                cityWind.text(data.list[0].wind.speed + ' MPH')
                for (var i = 0; i < 5; i++) {
                    $(cityTemp[i]).text('Temp: ' + data.list[i+1].main.temp)
                    $(cityHum[i]).text('Humidity: ' + data.list[i+1].main.humidity)
                    if (data.list[i+1].weather[0].main = "Clear"){
                        $(cityCloud[i]).text('🌞')
                        cityEmo.text('🌞')
                    } else if (data.list[i+1].weather[0].main = "Cloudy") {
                        $(cityCloud[i]).text('☁')
                        cityEmo.text('☁')
                    } else if (data.list[i+1].weather[0].main = "Rain") {
                        $(cityCloud[i]).text('🌧')
                        cityEmo.text('🌧')
                    } else if (data.list[i+1].weather[0].main = "Snow") {
                        $(cityCloud[i]).text('❄')
                        cityEmo.text('❄')
                    }
                }
                var long = data.city.coord.lon
                var lat = data.city.coord.lat
                return fetch('https://api.openweathermap.org/data/2.5/uvi?lat='+ lat +'&lon='+ long +'&appid=fdb0a3a60be763cc57b205caf5a7d419')
                    .then(function(response){
                        return response.json()
                    })
                    .then(function(data) {
                        console.log(data)
                        cityUV.text(data.value)
        
                        if (data.value <= 2) {
                            cityUV.attr('style', 'background-color: green')
                        } else if (data.value <= 5) {
                            cityUV.attr('style', 'background-color: yellow')
                        } else if (data.value <= 7) {
                            cityUV.attr('style', 'background-color: orange')
                        } else if (data.value <= 10) {
                            cityUV.attr('style', 'background-color: red')
                        }
                    })
            })
    }
}

function searchHistory() {
    var userInput = document.getElementById('cityName').value
    var exist = false

    if (localStorage.getItem('search') == null) {
        localStorage.setItem('search', '[]');
    };
    var searchArr = JSON.parse(localStorage.getItem('search'));
    for (i=0; i < searchArr.length; i++){
        if (searchArr[i] == userInput) {
            exist = true
            break;
        }
    }
    if(!exist) {
        searchArr.push(userInput)
        localStorage.setItem('search', JSON.stringify(searchArr));
        updateHistory();
    }

}

function displayHistory(){
   var update =  JSON.parse(localStorage.getItem('search'))
   if (update) {
       for (i=0; i< update.length; i++) {
        $(searchHist).append('<li class="list-group-item history">' + update[i] + '</li>')
       }
   }
}
searchHist.on('click','li', function(e) {
    e.preventDefault()
    var onClick = e.target.textContent
    console.log(onClick)
    var cityAPI = "https://api.openweathermap.org/data/2.5/forecast?q="+ onClick +"&units=imperial&appid=fdb0a3a60be763cc57b205caf5a7d419"

    fetch(cityAPI)
    .then(function(response) {
        console.log(response.status)
        if (response.status === 404) {
            cityNames.text("404 Error: City not found")
        } else {
            searchHistory();
            return response.json()
        }
        
    })
    .then(function(data) {
        console.log(data)
        cityNames.text(onClick);
        cityMainTemp.text(data.list[0].main.temp)
        cityHumid.text(data.list[0].main.humidity + '%')
        cityWind.text(data.list[0].wind.speed + ' MPH')
        for (var i = 0; i < 5; i++) {
            $(cityTemp[i]).text('Temp: ' + data.list[i+1].main.temp)
            $(cityHum[i]).text('Humidity: ' + data.list[i+1].main.humidity)
            if (data.list[i+1].weather[0].main = "Clear"){
                $(cityCloud[i]).text('🌞')
                cityEmo.text('🌞')
            } else if (data.list[i+1].weather[0].main = "Cloudy") {
                $(cityCloud[i]).text('☁')
                cityEmo.text('☁')
            } else if (data.list[i+1].weather[0].main = "Rain") {
                $(cityCloud[i]).text('🌧')
                cityEmo.text('🌧')
            } else if (data.list[i+1].weather[0].main = "Snow") {
                $(cityCloud[i]).text('❄')
                cityEmo.text('❄')
            }

        } 
        var long = data.city.coord.lon
        var lat = data.city.coord.lat
        return fetch('http://api.openweathermap.org/data/2.5/uvi?lat='+ lat +'&lon='+ long +'&appid=fdb0a3a60be763cc57b205caf5a7d419')
            .then(function(response){
                return response.json()
            })
            .then(function(data) {
                console.log(data)
                cityUV.text(data.value)

                if (data.value <= 2) {
                    cityUV.attr('style', 'background-color: green')
                } else if (data.value <= 5) {
                    cityUV.attr('style', 'background-color: yellow')
                } else if (data.value <= 7) {
                    cityUV.attr('style', 'background-color: orange')
                } else if (data.value <= 10) {
                    cityUV.attr('style', 'background-color: red')
                }
            })

    })

    
})


searchBtn.on('click', search)
function search() {
    var userInput = $('#cityName').val()
    if (!userInput) {
        return alert("please input valid city")
    }
    var cityAPI = "https://api.openweathermap.org/data/2.5/forecast?q="+ userInput +"&units=imperial&appid=fdb0a3a60be763cc57b205caf5a7d419"

    console.log(cityAPI)
    fetch(cityAPI)
        .then(function(response) {
            console.log(response.status)
            if (response.status === 404) {
                cityNames.text("404 Error: City not found")
            } else {
                searchHistory();
                return response.json()
            }
            
        })
        .then(function(data) {
            console.log(data)
            cityNames.text(userInput);
            cityMainTemp.text(data.list[0].main.temp)
            cityHumid.text(data.list[0].main.humidity + '%')
            cityWind.text(data.list[0].wind.speed + ' MPH')
            for (var i = 0; i < 5; i++) {
                $(cityTemp[i]).text('Temp: ' + data.list[i+1].main.temp)
                $(cityHum[i]).text('Humidity: ' + data.list[i+1].main.humidity)
                if (data.list[i+1].weather[0].main = "Clear"){
                    $(cityCloud[i]).text('🌞')
                    cityEmo.text('🌞')
                } else if (data.list[i+1].weather[0].main = "Cloudy") {
                    $(cityCloud[i]).text('☁')
                    cityEmo.text('☁')
                } else if (data.list[i+1].weather[0].main = "Rain") {
                    $(cityCloud[i]).text('🌧')
                    cityEmo.text('🌧')
                } else if (data.list[i+1].weather[0].main = "Snow") {
                    $(cityCloud[i]).text('❄')
                    cityEmo.text('❄')
                }

            } 
            var long = data.city.coord.lon
            var lat = data.city.coord.lat
            return fetch('https://api.openweathermap.org/data/2.5/uvi?lat='+ lat +'&lon='+ long +'&appid=fdb0a3a60be763cc57b205caf5a7d419')
                .then(function(response){
                    return response.json()
                })
                .then(function(data) {
                    console.log(data)
                    cityUV.text(data.value)

                    if (data.value <= 2) {
                        cityUV.attr('style', 'background-color: green')
                    } else if (data.value <= 5) {
                        cityUV.attr('style', 'background-color: yellow')
                    } else if (data.value <= 7) {
                        cityUV.attr('style', 'background-color: orange')
                    } else if (data.value <= 10) {
                        cityUV.attr('style', 'background-color: red')
                    }
                })

        })
    
}


function updateHistory() {
    var searchArr = JSON.parse(localStorage.getItem('search'));

    if (searchArr == null) {
        return;
    } else if (searchArr !=null) {
        i = searchArr.length-1
        $(searchHist).append('<li class="list-group-item history">' + searchArr[i] + '</li>')
    }

    
}

function clearHistory() {
    localStorage.clear()
}

displayHistory();

renderText()
