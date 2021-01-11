import Axios from 'axios'


let apiUrl

const apiUrls = {
    production: 'https://shoulder-app.herokuapp.com/',
    development: 'http://localhost:3001/'
}

if (window.location.hostname === 'localhost') {
    apiUrl = apiUrls.development
} else {
    apiUrl = apiUrls.production
}

const api = Axios.create({
    baseURL: apiUrl,
})

export default api