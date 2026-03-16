import React from 'react';
import './UserAvatar.css';

/**
 * UserAvatar - Displays user profile picture with initials fallback
 */
function UserAvatar({ username, email, size = 'medium', status = 'online' }) {
  // Generate initials from username
  const initials = username
    ? username
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  // Generate consistent color based on username
  const getColorIndex = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % 6;
  };

  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#06B6D4', // cyan
  ];

  const bgColor = colors[getColorIndex(username || '')];

  return (
    <div className={`user-avatar avatar-${size} avatar-status-${status}`}>
      <div className="avatar-image" style={{ backgroundColor: bgColor }}>
        <span className="avatar-initials">{initials}</span>
      </div>
      {status && <div className="avatar-status-indicator"></div>}
    </div>
  );
}

export default UserAvatar;
