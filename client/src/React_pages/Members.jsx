import React, { Component } from 'react'
import { Link } from "react-router-dom"
import '../assets/post-table.scss'

export default class Members extends Component {

    render() {
        return (
            <div className="MembersList">
                {this.props.users &&
              this.props.users.map((user) => (
                <div className="user">
                  <Link to={`/member/${user.id}`}>
                    <h2>{user.username}</h2>
                          <img src={user.url} alt={user.username} />
                  </Link>
                </div>
              ))}

                
            </div>
        )
    }
}
