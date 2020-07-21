
// import React, { Component } from 'react'
// import { getPosts, updatePosts } from '../../services/apihelper';

// export default class EditPosts extends Component {
//     state = {
//         currentPost: {},
//         posts: [],
//         post: {
//           title: "",
//           description: "",
//           body: "",
//         },
//       };
//   componentDidMount = async() =>  {
//     // if (this.props.post) {
//     //   this.setFormData();
//     // }
//     console.log("ste")

//     const id = await getUserPosts(id);
//     const currentPost = posts.find(post => (
//         post.id = parseInt(currentPost)
      
//     ))
//       this.setState({
//         currentPost: currentPost
//     })
//   }

//   componentDidUpdate(prevProps) {
//     if ( prevProps.post !== this.props.post ) {
//       this.setFormData();
//     }
//   }

//   setFormData = () => {
//     this.setState({
//         title: this.props.post.title,
//         description: this.props.post.description,
//         body: this.props.post.body
//     })
//   }

//   handleChange = (e) => {
//     const { value } = e.target;
//     this.setState({
//         title: value,
//         description: value,
//         body: value
//     })
//   }

//     render() {
//         const { editPosts, history, id } = this.props;
//         return (
//             <div>
//                 {this.state.currentPost &&
//                     this.state.currentPost.map((currentPost) => (
//                         <form onSubmit={(e) => {
//                             e.preventDefault();
//                             editPosts(id, this.state);
//                             history.push('/posts');
//                         }}>
//                             <h3>Edit Posting</h3>
//                             <label>
//                                 Title:
//           <input
//                                     type='text'
//                                     value={this.state.currentPost.title}
//                                     onChange={this.handleChange}
//                                 />
//                             </label>
//                             <label>
//                                 Description:
//           <input
//                                     type='text'
//                                     value={this.state.currentPost.description}
//                                     onChange={this.handleChange}
//                                 />
//                             </label>
//                             <label>
//                                 Body:
//           <input
//                                     type='text'
//                                     value={this.state.currentPost.body}
//                                     onChange={this.handleChange}
//                                 />
//                             </label>
//                             <button>Submit</button>
//                         </form>
//                     )
//                     )
//                 }
//             </div>)
// }}