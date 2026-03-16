import React from "react"
import UserAvatar from "./UserAvatar"
import "./OnlineUsers.css"

/**
 * OnlineUsers - Display real-time presence of active collaborators
 * Shows avatar-based presence indicators for each online user
 */
function OnlineUsers({ users = [] }) {
  if (!users || users.length === 0) {
    return null
  }

  return (
    <div className="online-users">
      <div className="online-users-label">
        <span className="online-indicator-dot"></span>
        <span className="online-count">{users.length} {users.length === 1 ? 'user' : 'users'} online</span>
      </div>

      <div className="online-users-avatars">
        {users.map((user, index) => (
          <div key={index} className="user-avatar-wrapper" title={user.username}>
            <UserAvatar
              username={user.username}
              email={user.email}
              size="small"
              status="online"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default OnlineUsers
