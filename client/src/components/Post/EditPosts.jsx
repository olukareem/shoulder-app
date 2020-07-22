import React, { Component } from "react";
import {
  getOnePost,
  updatePosts,
  getUserPosts,
} from "../../services/apihelper";
import '../../assets/post-table.scss'

export default class EditPosts extends Component {
  state = {
    currentPost: { title: "", description: "", body: "" },
  };
  componentDidMount = async () => {
    const id = this.props.match.params.id;
    const currentPost = await getOnePost(id);

    this.setState({
      currentPost: {
        title: currentPost.title,
        description: currentPost.description,
        body: currentPost.body,
      },
    });
  };

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState((prevState) => ({
      currentPost: {
        ...prevState.currentPost,
        [name]: value,
      },
    }));
  };

  render() {
    const { editPosts, history } = this.props;
    return (
      <div         class="py-2 max-w-full"
            style={{margin: "0 6.667vw"}}>
                    <h1 className="Post-Page-Title">Make an update</h1>

            {this.state.currentPost && (
                <div className="State-div">
                    <ul className="Edit-Table-Flex-Contain">
                    <form 
            onSubmit={(e) => {
              e.preventDefault();
              editPosts(this.props.match.params.id, this.state.currentPost);
              history.push("/posts");
            }}
          >
          <li>
            <label className="Post-Title">
              Title:
              <input 
                type="text"
                name="title"
                value={this.state.currentPost.title}
                onChange={this.handleChange}
              />
                            </label>
                            <hr className="Table-Divide"></hr>
                            </li>
                            <li style={{ padding: "0.767vw 0" }}>
    
            <label className="Post-Title">
              Description:
              <input
                type="text"
                name="description"
                value={this.state.currentPost.description}
                onChange={this.handleChange}
              />
                                </label>
                            </li> 
                            <hr className="Table-Divide"></hr>
                            <li style={{ padding: "0.767vw 0" }}>

            <label class="font-light">
              Body:
              <input className="Body-Edit"
                type="text"
                name="body"
                value={this.state.currentPost.body}
                onChange={this.handleChange}
              />
                                </label>
                            </li>
                            <hr className="Table-Divide"></hr>

            <button>Submit</button>
                    </form>
                    </ul>
                    </div>
        )}
      </div>
    );
  }
}
