
import React, { Component } from 'react'
import { getOnePost, updatePosts, getUserPosts } from '../../services/apihelper';

export default class EditPosts extends Component {
    state = {
        currentPost: { title: "",
        description: "",
        body: ""},
    };
    componentDidMount = async () => {
        // if (this.props.post) {
        //   this.setFormData();
        // }
        console.log("ste")
            const id = this.props.match.params.id
        const currentPost = await getOnePost(id);
            
        this.setState({
            currentPost: { title: currentPost.title,
            description: currentPost.description,
            body: currentPost.body}
        })
    }



    handleChange = (e) => {
        const { value, name } = e.target;
        this.setState(prevState => ({
            currentPost: {
                ...prevState.currentPost,
            [name]:value
            } 
        }))
    }

    render() {
        const { editPosts, history, } = this.props;
        return (
            <div>
                {this.state.currentPost &&
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            editPosts(this.props.match.params.id, this.state.currentPost);
                            history.push('/posts');
                        }}>
                            <h3>Edit Posting</h3>
                            <label>
                                Title:
          <input
                            type='text'
                            name="title"
                                    value={this.state.currentPost.title}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label>
                                Description:
          <input
                            type='text'
                            name="description"
                                    value={this.state.currentPost.description}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label>
                                Body:
          <input
                            type='text'
                            name="body"
                                    value={this.state.currentPost.body}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <button>Submit</button>
                        </form>
                    
                    
                }
            </div>)
    }
}