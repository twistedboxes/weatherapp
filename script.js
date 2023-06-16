// Let's target the fields I need to replace with values from the API

let weatherIcon = document.querySelector(".top-sect i")

// 1: Degrees
let degreesDigit = document.getElementsByClassName("Cifra").item(0)
// Per cambiare il numero, devo cambiare l'innerText

// 2: WMO

let wmo = document.querySelector(".Weather-desc p")

// 3. City

let city = document.querySelectorAll(".Weather-desc p").item(1)

// 4. WindSpeed

let windSpeed = document.querySelectorAll("li")[0]

// 5. Humidity

let humidity = document.querySelectorAll("li")[1]

// 6. Precipitation Probability

let precipitationProbability = document.querySelectorAll("li")[2]


let form = document.getElementById("writtenText")

function submitForm(ev) {
    console.log("form submitted")
    ev.preventDefault()

    let userInput = document.getElementById("fname").value
    
    getData(userInput)
}

form.addEventListener("submit", submitForm)


async function getData(userInput) {

    let location = "https://geocoding-api.open-meteo.com/v1/search?name=" + userInput
    let getLocation = await fetch(location)

    let locJson = await getLocation.json()
    let locLatitude = locJson.results[0].latitude
    let locLongitude = locJson.results[0].longitude
    let latAndLong = [locLatitude, locLongitude]
    let croppedLat = latAndLong[0].toString().slice(0, 5)
    let croppedLong = latAndLong[1].toString().slice(0, 5)
    let croppedCoord = `latitude=${croppedLat}&longitude=${croppedLong}`


    console.log(croppedCoord)

    function iconSwitcher(toChange) {
        switch (toChange) {
            case 0:
            case 1:
            case 2:
            case 3:
                return "fa-solid fa-sun"
                break;
            case 45:
            case 48:
                return "fa-solid fa-smog"
                break;
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
                return "fa-solid fa-droplet"
                break;
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
                return "fa-solid fa-cloud-rain"
                break;
            case 71:
            case 73:
            case 75:
            case 77:
                return "fa-solid fa-snowflake"
                break;
            case 80:
            case 81:
            case 82:
                return "fa-solid fa-cloud-showers-heavy"
                break;
            case 85:
            case 86:
                return "Snow fa-solid fa-snowflake"
                break;
            case 95:
            case 96:
            case 99:
            case "*":
                return "fa-solid fa-cloud-bolt"
                break;
            default:
                return "fa-solid fa-spinner"
        }

    }

    function switcheroo(toChange) {
        switch (toChange) {
            case 0:
            case 1:
            case 2:
            case 3:
                return "Clear"
                break;
            case 45:
            case 48:
                return "Fog"
                break;
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
                return "Drizzle"
                break;
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
                return "Rain"
                break;
            case 71:
            case 73:
            case 75:
            case 77:
                return "Snow"
                break;
            case 80:
            case 81:
            case 82:
                return "Rain showers"
                break;
            case 85:
            case 86:
                return "Snow showers"
                break;
            case 95:
            case 96:
            case 99:
            case "*":
                return "Thunderstorm"
                break;
            default:
                return "Loading"
        }

    }


    let myTime = new Date()
    let croppedtime = myTime.getHours()

    // let data = await fetch("https://api.open-meteo.com/v1/forecast?latitude=39.29&longitude=9.00&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m&windspeed_unit=ms&timezone=auto")
    let data = await fetch(`https://api.open-meteo.com/v1/forecast?${croppedCoord}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m&windspeed_unit=ms&timezone=auto`)

    let dataJson = await data.json()



    degreesDigit.innerText = dataJson.hourly.temperature_2m[croppedtime] + "°"
    wmolist = dataJson.hourly.weathercode[croppedtime]
    wmo.innerText = switcheroo(wmolist)
    city.innerText = userInput
    windSpeed.innerText = dataJson.hourly.windspeed_10m[croppedtime] + "ms"
    humidity.innerText = dataJson.hourly.relativehumidity_2m[croppedtime] + "%"
    precipitationProbability.innerText = dataJson.hourly.precipitation_probability[croppedtime] + "%"
    switcheroo(wmolist)
    weatherIcon.className = iconSwitcher(wmolist)

}



