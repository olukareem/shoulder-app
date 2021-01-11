// import api from './apihelper'
import api from './apiconfig'

export const loginUser = async (loginData) => {
    console.log(api.baseURL)
    const resp = await api.post('/auth/login', {
        authentication: loginData
    })
    localStorage.setItem('authToken', resp.data.token);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`
    return resp.data.user
}

export const registerUser = async (registerData) => {
    console.log(registerData)
    const resp = await api.post('/users', { user: registerData })
    console.log(resp)
    localStorage.setItem('authToken', resp.data.token);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`
    return resp.data.user
}

export const verifyUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        api.defaults.headers.common.authorization = `Bearer ${token}`
        const resp = await api.get('/auth/verify');
        return resp.data
    }
    return false
}

export const removeToken = () => {
    api.defaults.headers.common.authorization = null
  }