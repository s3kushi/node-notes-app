const request = require('postman-request')

const geocodePromise = address => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiZGFuaWVsLWR1YXJ0ZSIsImEiOiJja2poajhob3oycWNpMnJuMGswY2dhMndlIn0.47JOaZyg0_atqF0n6zBuDw`

    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, { body } = {}) => {
            if (error) {
                return reject('Unable to connect to location service')
            }
            if (!body.features || !body.features.length) {
                return reject('Unable to find location')
            }
            resolve({
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: body.features[0].place_name
            })
        })
    })
}

const geocodeCallback = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiZGFuaWVsLWR1YXJ0ZSIsImEiOiJja2poajhob3oycWNpMnJuMGswY2dhMndlIn0.47JOaZyg0_atqF0n6zBuDw`

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            return callback('Unable to connect to location service', undefined)
        }
        if (!body.features || !body.features.length) {
            return callback('Unable to find location', undefined)
        }
        callback(undefined, {
            longitude: body.features[0].center[0],
            latitude: body.features[0].center[1],
            location: body.features[0].place_name
        })
    })
}

module.exports = {
    geocodeCallback,
    geocodePromise
}