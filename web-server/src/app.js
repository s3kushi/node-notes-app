const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocoder = require('./utils/geocode')
const forecast = require('./utils/forecast')

// create app
const app = express()

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// set static directory
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        errorMessage: 'Help article not found.'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About'
    })
})

app.get('/weather', async (req, res) => {
    const { address } = req.query;

    if(!address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    try {
        const { latitude, longitude, location } = await geocoder.geocodePromise(address)
        const forecastData = await forecast.forecastPromise(latitude, longitude)

        res.send({
            forecast: forecastData,
            location,
            address
        })

    } catch (error) {
        return res.send({ error })
    }
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000.')
})