const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const inputLocation = process.argv[2]

if (!inputLocation) return console.error('Location parameter missing')

callbackMethod = () => {
    geocode.geocodeCallback(inputLocation, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return console.log(error)
        }
    
        forecast.forecastCallback(latitude, longitude, (error, forecastData) => {
            if (error) {
                return console.log(error)
            }
            console.log('Location ', location)
            console.log('Forecast ', forecastData)
        })
    })
}

asyncMethod = async () => {
    try {
        const { latitude, longitude, location } = await geocode.geocodePromise(inputLocation)
        const forecastData = await forecast.forecastPromise(latitude, longitude)

        console.log('Location ', location)
        console.log('Forecast ', forecastData)
    } catch (error) {
        console.log(error)
    }
}

//callbackMethod()
//asyncMethod()