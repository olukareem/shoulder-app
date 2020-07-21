import React, { Component, useState } from "react";
import { getUserPosts, addPost, deletePost, updatePost} from "../services/apihelper";
import { withRouter, Link } from "react-router-dom";
import $ from 'jquery';

class User_Profile extends Component {
  state = {
    posts: null,
      addPost: false,
    editable: false,
    post: {
      title: "",
      description: "",
      body: "",
    },
  };
  componentDidMount = async () => {
    const id = this.props.match.params.id;
    const posts = await getUserPosts(id);
    this.setState({
      posts,
    });
  };

  toggleAdd = () => {
    this.setState((prevState) => ({
      addPost: !prevState.addPost,
    }));
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      post: {
        ...prevState.post,
        [name]: value,
      },
    }));
  };

  handleAdd = async (e) => {
    e.preventDefault();
    const newPost = await addPost(this.props.match.params.id, this.state.post);
    this.setState((prevState) => ({
      posts: [...prevState.posts, newPost],
    }));
  };

    
    
  removePosts = async (id) => {
      const deleted = await deletePost(id);
      this.setState((prevState) => ({
          posts: prevState.posts.filter(onePost => onePost.id != deleted.id)
      }))
  };

  getInitialState() {
    return {editable: false}
}
    handleEdit() {
        if(this.state.editable) {
            const title = this.refs.title.value;
            const id = this.props.item.id;
            const description = this.refs.description.value;
            const item = {id: id , title: title , description: description};
            this.props.handleUpdate(item);

            console.log('in handleEdit', this.state.editable, title, description);
    
        }
    this.setState({editable: !this.state.editable})
}
    
    
onUpdate(item) {
    this.props.onUpdate(item);
}
    
handleUpdate(item) {
    $.ajax({
            url: `/users/:user_id/posts/${item.id}`,
            type: 'PUT',
            data: { item: item },
            success: () => {
                console.log('Updated!');
                //this.updateItems(item);
                // callback to swap objects
            }
        }
    )}
    
    updateItems(item) {
        var items = this.state.items.filter((i) => { return i.id != item.id });
        items.push(item);
    
        this.setState({items: items });
    }
    // editPosts = async (id) => {
    //     const changePost = await updatePost(id);
    //     this.setState((prevState) => ({
    //         posts: prevState.posts.filter(onePost => onePost.id != deleted.id)
    //     }))
    // }

  render() {

    // const title = this.state.editable ? <input type='text' defaultValue={post.title} /> : <h3>{post.title}</h3>;
    // const description = this.state.editable ? <input type='text' defaultValue={post.description} />: <h3>{post.description}</h3>;
    return (
      <div>
{        <h1>Your Posts</h1>
}        {this.state.posts &&
          this.state.posts.map((post) => (
            <div className="post">
                  {/* <h3>{post.title}</h3> */}
                  {this.state.editable ? <input type='text' ref='title' defaultValue={post.title} /> : <h3>{post.title}</h3>}
                  {this.state.editable ? <input type='text'ref='description' defaultValue={post.description} />: <h3>{post.description}</h3>}
              {/* <h3>{post.description}</h3> */}
              <h3>{post.body}</h3>

              {/* <button
                placeholder="Edit"
                onClick={() => {this.editPosts(post.id)}}
              >
                      edit
              </button> */}
                  
              <button onClick={this.handleEdit}>
  {" "}
  {this.state.editable ? "Submit" : "Edit"}{" "}
</button>



              <button
                placeholder="Delete"
                onClick={() => {this.removePosts(post.id)}}
              >
                delete
              </button>
            </div>
          ))}

        <Link to="/post/new">
          <button>New</button>
        </Link>
      </div>
    );
  }
}

export default withRouter(User_Profile);
