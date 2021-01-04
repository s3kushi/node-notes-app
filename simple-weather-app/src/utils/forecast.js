const request = require('postman-request')

const forecastPromise = (latitude, longitude) => {
    const url = `http://api.weatherstack.com/current?access_key=d674ffd19a5038c601fe203227d2c081&query=${latitude},${longitude}&units=m`

    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, { body } = {}) => {
            if (error) {
                reject('Unable to connect to weather service')
                return
            }
            if (body.error) {
                reject('Unable to find location')
                return
            }
            resolve(`${body.current.weather_descriptions[0]} It is currently ${body.current.temperature} degrees out. 
                    It feels like ${body.current.feelslike} degrees out.`)
        })
    })
}

const forecastCallback = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=d674ffd19a5038c601fe203227d2c081&query=${latitude},${longitude}&units=m`

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
            return
        }
        if (body.error) {
            callback('Unable to find location', undefined)
            return
        }
        callback(undefined,
            `${body.current.weather_descriptions[0]} It is currently ${body.current.temperature} degrees out. 
            It feels like ${body.current.feelslike} degrees out.`)
    })
}

module.exports = {
    forecastCallback,
    forecastPromise
}