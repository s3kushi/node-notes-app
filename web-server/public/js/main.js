const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

const fetchWeather = address => {
    fetch(`/weather?address=${address}`).then(response => {
        response.json().then(jsonData => {
            if (jsonData.error) { 
                messageOne.textContent = jsonData.error
                return console.error(jsonData.error)
            }
            messageOne.textContent = jsonData.location
            messageTwo.textContent = jsonData.forecast
            return jsonData
        })
    }).catch(e => {
        console.error(e)
    })
}

weatherForm.addEventListener('submit', e => {
    const location = search.value
    e.preventDefault()

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    fetchWeather(location)
})