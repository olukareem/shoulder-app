import api from './api_configuration'

export const getUsers = async () => {
    const response = await api.get('/users')
    return response.data
}

export const getPosts = async () => {
    const response = await api.get('users/1/posts')
    return response.data
}

export const getCategories = async () => {
    const response = await api.get('categories')
    return response.data
}

export const addPost = async (id, postInfo) => {
    const response = await api.post(`/users/${id}/posts`, { post: postInfo })
    return response.data
}
  
