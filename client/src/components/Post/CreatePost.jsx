import React, { Component } from "react";
import {getCategories} from "../../services/apihelper"

export default class CreatePost extends Component {
  state = {
    postData: {
    title: "",
        description: "",
        category_ids: [],
          body: ""
      },
      categories: []
};

// categories: [],
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
      console.log(this.props.categories[0].name)
  };

  handleInputChange = (event) => {
    const value = [parseInt(event.target.value)];

    const target = event.target;
    if (target.checked) {
      this.setState((prevState) => ({
        category_ids: [...prevState.postData.category_ids, ...value],
      }));
    } else {
      const filtered = this.state.category_ids.filter((id) => {
        return id !== value[0];
      });
      this.setState({
        category_ids: filtered,
    });
   
    }
  };
    componentDidMount = async () => {
        const categories = await getCategories();
        this.setState({
            categories,
        });
        console.log(this.state.categories)
 }


  render() {
    //   const categoriesData =
    //       this.props.categories.map((category) => (
    //   <div class="inline-flex flex-row">
    //     <input
    //     //   type="checkbox"
    //     //   id={category.id}
    //       name={category.name}
    //     //   checked={this.state.name}
    //     //   onChange={this.handleInputChange}
    //     //   value={category.id}
    //     />
    //     <label for="category">{category.name}</label>
    //   </div>
    // ));
    return (
      <div>
        <ul
          class="py-8 max-w-full m-auto "
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            textAlign: "center",
          }}
        >
          <li>
            <h1
              style={{
                textShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                color: "#322e3b",
                fontFamily: "Helvetica",
                fontSize: "2.8vw",
              }}
            >
              Create a post{" "}
            </h1>
          </li>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              this.props.handleAdd(this.state);
              this.props.history.push(`/profile/${this.props.currentUser.id}`);
              
            }}
          >
            <li
              style={{
                position: "relative",
                padding: "0.833vw",
                fontSize: "0.967vw",
              }}
            >
              <input
                name="title"
                placeholder="Title"
                type="text"
                value={this.state.title}
                onChange={this.handleChange}
                style={{
                  width: "44.4vw",
                  height: "3.067vw",
                  borderRadius: "0.8vw",
                  textIndent: "1.067vw",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                }}
              />
            </li>
            <li
              style={{
                position: "relative",
                padding: "0.833vw",
                fontSize: "0.967vw",
              }}
            >
              <input
                name="description"
                placeholder="Description"
                type="text"
                value={this.state.description}
                onChange={this.handleChange}
                style={{
                  width: "44.4vw",
                  height: "3.067vw",
                  borderRadius: "0.8vw",
                  textIndent: "1.067vw",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                }}
              />
            </li>
            <li
              style={{
                position: "relative",
                padding: "0.833vw",
                fontSize: "0.967vw",
              }}
            >
              <textarea
                name="body"
                type="text"
                placeholder="Body"
                value={this.state.body}
                onChange={this.handleChange}
                style={{
                  width: "44.4vw",
                  height: "20.067vw",
                  borderRadius: "0.8vw",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                  paddingTop: "1.067vw",
                  paddingLeft: "1.067vw",
                }}
              />
                    </li>
                <li> {this.state.categories.map((category) => (
    <div class="inline-flex flex-row">
    <input
      type="checkbox"
      id={category.id}
        name={category.name}
      checked={this.state.name}
      onChange={this.handleInputChange}
      value={category.id}
    />
    <label for="category">{category.name}</label>
    </div>
))}</li>
            {/* <li>{categoriesData}</li> */}

            <li class="p-4 md:p-4 sm:p-4">
              <button
                placeholder="submit"
                type="submit"
                class="font-medium text-white"
                style={{
                  fontFamily: "Helvetica",
                  height: "3.933vw",
                  width: "9.967vw",
                  fontWeight: "550",
                  fontSize: "1.617vw",
                  borderRadius: "0.8vw",
                  background: "#85c0be",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                }}
              >
                Add Post
              </button>
            </li>
          </form>
          {/* } */}
        </ul>
      </div>
    );
  }
}
