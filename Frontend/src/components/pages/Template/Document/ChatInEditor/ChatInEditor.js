import React from 'react'
import Chat from '../../../../pages/chat/Chat'

const ChatInEditor = (props) => {
  console.log(props.AUTH_TOKEN)
  return (
    <Chat
      FROM_EDITOR={true}
      AUTH_TOKEN={props.AUTH_TOKEN}
    />
  )
}

export default ChatInEditor