import React from "react"
import "./OnlineUsers.css"

function OnlineUsers({ users }) {

  return (

    <div className="online-users">

      <h4>Online Users</h4>

      {users.map((u, index) => (

        <div key={index} className="user-badge">

          {u.username}

        </div>

      ))}

    </div>

  )

}

export default OnlineUsers