import Axios from 'axios'


let apiUrl
// const baseUrl = process.env.NODE_ENV === 'production' ? 'https://shoulder-api.herokuapp.com/' : 'http://localhost:3000' 

const apiUrls = {
    production: 'https://shoulder-api.herokuapp.com/',
    development: 'http://localhost:3000/'
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