// YOUR CODE HERE:

app = {

  server: "http://parse.sfm6.hackreactor.com/chatterbox/classes/messages",

  messageList: [],

  init: () => {
    app.fetch();
  },

  send: (message) => {
    message.emoji="haha"
    console.log('data sending', JSON.stringify(message));

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    })
  },

  fetch: () => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: "http://parse.sfm6.hackreactor.com/chatterbox/classes/messages",
      type: 'GET',
      contentType: 'application/json',
      data: { order: "-createdAt" },
      success: function (data) {
        console.log('fetch worked!');
        console.log(data.results);
        data = data.results;

        var roomObj = {};

        data.forEach(message => {
          if (!roomObj[message.roomname]) {
            roomObj[message.roomname] = true;
          }
          app.messageList.push(message);
          app.renderMessage(message)
        });

        for (let roomname in roomObj) {
          if (roomname !== "undefined" && roomname !== "" && roomname !== "null" && roomname.toLowerCase() !== "all" && roomname.toLowerCase() !== "all rooms" ) {
            console.log('ROOMNAME', roomname);
            app.addToRoomList(roomname)
          }
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    });
  },

  clearMessages: () => {
    $('#chats').empty();
  },

  renderMessage: (messageData) => {
    // console.log(messageData);
    var node = $('<div>');
    node.addClass("chat");

    var userNode = $('<div>');
    userNode.addClass('username');
    userNode.text(messageData.username);
    userNode.on('click', function () {
      app.handleUsernameClick(messageData.username);
    })

    var dateNode = $('<div>');
    dateNode.addClass('date');
    dateNode.text(messageData.createdAt);

    var messageNode = $('<div>');
    messageNode.addClass('message');
    messageNode.text(messageData.text);


    node.append(userNode);
    node.append(messageNode);
    node.append(dateNode);

    $('#chats').append(node);

  },

  renderRoom: (roomname) => {
    app.clearMessages();
    if (roomname === "all") {
      app.messageList.forEach(message => app.renderMessage(message));
    } else {
      app.messageList.filter(message => roomname===message.roomname).forEach(message => app.renderMessage(message));
    }
  },

  addToRoomList: (roomname) => {
    $('#roomSelect').append($(`<option class="roomOption" value=${roomname}>${roomname}</option>`))
  },

  handleUsernameClick: (username) => {
    console.log(`${username} clicked`);
  },

  handleSubmit: (data) => {
    // console.log('submitted');
    // app.send($("form#send").serialize());
    app.send(data);
  },

  showAlert: () => {
    alert("alert something");
  }
}

$(document).ready(function () {
  app.init()

  $('#send').on("submit", function (event) {
    event.preventDefault()

    var username = window.location.search.split("=")[1];
    console.log('USERNAME', username);

    var text = $("#message").val();
    console.log('TEXT', text);

    var roomSelected = $("#roomSelect").val();
    console.log('ROOM', roomSelected.toLowerCase());
    if (!roomSelected || roomSelected.toLowerCase() === 'undefined' || roomSelected.toLowerCase() === "null" || roomSelected.toLowerCase() === "all") {
      roomSelected = undefined;
    }

    var messageObj = {
      username,
      text,
      roomname: ""
    }
    app.handleSubmit(messageObj)
  })

  // NEW ROOM REQUEST

  var newRoomName;
  $("#roomSelect").on("change", ()=> {

    if ($("#roomSelect").val() === "new") {
      var newRoomName;
      while ($("#roomSelect").val() === "new" && !newRoomName) {
          newRoomName= prompt("Enter new room name");
          console.log('newRoomName', newRoomName);
          $("#roomSelect").val("all")
      }

      if (newRoomName) {
        $("#roomSelect").append($(`<option val=${newRoomName}>${newRoomName}</option>`))
        $("#roomSelect").val(`${newRoomName}`);
      }
    } else {
      app.renderRoom($("#roomSelect").val());
    }
  })


  // $("#message").on("input", function(event){
  //   // console.log(event.target.value);
  // })



})
