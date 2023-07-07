function darkLight() {
    const body = document.body
    const topSect = document.querySelector(".top-sect")
    const icon = document.querySelector(".fa-solid")
    const botSect = document.querySelector(".bot-sect")
    const btn = document.getElementById("toggleBtn")

    if(body.style.backgroundColor != "rgb(5, 5, 5)") {
        body.style.backgroundColor= "rgb(5, 5, 5)"
        topSect.style.backgroundColor = "rgb(29, 28, 28)"
        icon.style.color = "whitesmoke"   
        botSect.style.backgroundColor = "rgb(50, 50, 80)"
        btn.style.color = ("white")
    }
    else {
        body.style.backgroundColor = "coral"
        topSect.style.backgroundColor = "white"
        icon.style.color = "rgb(29,29,29)"
        botSect.style.backgroundColor = "rgb(39,39,39)"
        btn.style.color = ("rgb(39,39,39)")
    }
}

const btn = document.getElementById("toggleBtn")

btn.addEventListener("click", darkLight)


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



function decodeWmo(toChange) {
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





class Card {
    constructor(icon, wmo, temp, city, windspd, humi, precip) {
        this.icon = icon;
        this.wmo = wmo;
        this.temp = temp;
        this.city = city;
        this.windspd = windspd;
        this.humi = humi;
        this.precip = precip
        this.handleForm()
    }



    submitForm(ev) {

        console.log("form submitted", ev)
        //ev.preventDefault()

        let userInput = document.getElementById("fname").value

        console.log(userInput)
        return userInput
    }





    handleForm() {
        let form = document.getElementById("writtenText")
        form.addEventListener("submit", this.populateData.bind(this))

    }



    async getLocation() {

        let userInput = this.submitForm()
        let location = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${userInput}`)
        let jsonLocation = await location.json()

        //GUARDARE ROBA SU "OBJECT DESTRUCTURING"
        let { name, latitude, longitude } = jsonLocation.results[0]

        let locProps = {
            city: name,
            cityLat: latitude,
            cityLong: longitude
        }
        return locProps
    }


    async getData(userInput) {
        let myTime = new Date()
        let currentTime = myTime.getHours()
        let { city, cityLat, cityLong } = await this.getLocation()
        userInput = `latitude=${cityLat}&longitude=${cityLong}`
        let res = await fetch(`https://api.open-meteo.com/v1/forecast?${userInput}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m`)
        let jsonRes = await res.json()
        let hourly = jsonRes.hourly
        let temp = `${hourly.temperature_2m[currentTime]}°`
        let wmo = decodeWmo(jsonRes.hourly.weathercode[currentTime])
        let windspd = `${hourly.windspeed_10m[currentTime]}ms`
        let precip = `${hourly.precipitation_probability[currentTime]}%`
        let humi = `${hourly.relativehumidity_2m[currentTime]}%`
        let cleanData = { city, wmo, temp, windspd, humi, precip }
        let icon = document.querySelector(".top-sect i")
        icon.className =iconSwitcher(jsonRes.hourly.weathercode[currentTime])
            console.log(icon)
        return cleanData
    }


    async populateData(ev) {

        ev.preventDefault()
        let cleanData = await this.getData()
        for (const propName in cleanData) {
            document.querySelector(`.${propName}`).textContent = cleanData[propName]
        }


    }
}



let testCard = new Card("icon", "wmo", "temp", "city", "windspd", "humi", "precip")







