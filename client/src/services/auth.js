import api from './apiConfig'

// export const signUp = async credentials => {
//     try {
//         const resp = await api.post('/sign-up', credentials)
//         localStorage.setItem('token', resp.data.token)
//         return resp.data
//     } catch (error) {
//         throw error
//     }
// }

// export const signInUser = async credentials => {
//     try {
//         const resp = await api.post('/sign-in', credentials)
//         localStorage.setItem('token', resp.data.token)
//         return resp.data
//     } catch (error) {
//         throw error
//     }
// }

// export const signOut = async user => {
//     try {
//         await localStorage.clear()
//         return true
//     } catch (error) {
//         throw error
//     }
// }

export const loginUser = async (loginData) => {
    const resp = await api.post('/auth/login', {
        authentication: loginData
    })
    localStorage.setItem('authToken', resp.data.token);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`
    return resp.data.user
}

export const registerUser = async (registerData) => {
    const resp = await api.post('/users', { user: registerData })
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