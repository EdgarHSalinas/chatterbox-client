// YOUR CODE HERE:

app = {

    server: "http://parse.sfm6.hackreactor.com/chatterbox/classes/messages",

    init: () => {
      app.fetch();

    },

    send: (message) => {
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
        data: {order: "-createdAt"},
        success: function (data) {
          console.log('fetch worked!');
          console.log(data.results);
          data = data.results;

          var roomObj = {};

          data.forEach(message => {
            if (!roomObj[message.roomname]) {
              roomObj[message.roomname] = true;
            }

            app.renderMessage(message)
          });

          for (let key in roomObj) {
            $('#roomSelect').append($(`<option class="roomOption" value=${key}>${key}</option>`))
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

      var dateNode = $('<div>');
      dateNode.addClass('date');
      dateNode.text(messageData.createdAt);

      var messageNode = $('<div>');
      messageNode.addClass('message');
      messageNode.text(messageData.text);

      node.append(userNode);
      node.append(messageNode);
      node.append(dateNode);

      // node.html(JSON.stringify(messageData))
      node.on('click', function() {
        app.handleUsernameClick();
      })

      $('#chats').append(node);

    },

    renderRoom: (roomname) => {
      var node = $('<div>');
      node.innerText = JSON.stringify(roomname);
      $('#roomSelect').append(node);
    },

    handleUsernameClick: () => {
    },

    handleSubmit: () => {

    },

    showAlert: () => {
      alert("alert something");
    }
  }

  $(document).ready(function() {
    app.init()

    $('#send .submit').on( "submit", function(event){
      app.handleSubmit()
    } )



  })
