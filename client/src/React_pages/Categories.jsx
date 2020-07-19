import React, { Component } from 'react'
import {getOneCategory, addPost} from '../services/apihelper'

export default class Categories extends Component {
    state = {
        category: null
    }
    componentDidMount = async () => {
        const category = await getOneCategory(this.props.match.params.id)
        this.setState({
    category
})
}

    render() {
        return (
        <>
           {this.state.category && <div>
                <h1>Category: {this.state.category.name}</h1>
                {this.state.category.posts.map(post => (<div><p>{post.body}</p></div>))}
            </div>} </>
        )
    }
}
