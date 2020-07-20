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
                        <ul
          class="py-16 max-w-full m-auto "
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            textAlign: "center",
          }}
                >
                    <li>
           {this.state.category && <div>
                <h1 style={{
                textShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                color: "#322e3b",
                fontFamily: "Helvetica",
                fontSize: "4.8vw",
              }}>Category: {this.state.category.name}</h1>
                            {this.state.category.posts.map(post => (<ul
                                style={{
                                    backgroundColor: "#F8F8F8",
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "nowrap",
                                    flexFlow: "row wrap",
                                    textAlign: "center",
                                                width: "44.4vw",
                                                height: "20.067vw",
                                                borderRadius: "0.8vw",
                                                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                                                  paddingTop: "1.067vw",
                                                  paddingLeft: "1.067vw"
                                              }}
                            
                            >
                                <li><p>{post.title}</p></li>
                                <li><p>{post.description}</p></li>
                                <li><p>{post.body}</p></li></ul>))}
                        </div>}
                        </li>
            </ul>
                    
                </>
        )
    }
}
