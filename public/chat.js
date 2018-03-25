console.log(access_token)
console.log(tokenUser)


$(function(){
  var socket = io.connect('http://localhost:9000')

  var message = $("#message")
  var send_username = $("#send_username")
  var username = $("#username")
  var send_message = $("#send_message")
  var chatroom = $("#chatroom")

  send_username.click(function(){
    console.log(tokenUser)
    socket.emit('change_username', {username : tokenUser})
  })

  send_message.click(function(){
    socket.emit('new_message', {message : message.val() })
  })

  socket.on("new_message", (data) => {
    console.log(data)
    chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
  })


})
