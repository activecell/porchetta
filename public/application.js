$(function () {
  var socket = io.connect('http://porchetta.herokuapp.com:3000');

  var $sendButton = $('#send-button');
  $sendButton.click(function (event) {
    event.preventDefault();
    console.log('Send button clicked!');
    $sendButton.attr('disabled', 'disabled');

    var $message = $('#message');

    var message = $message.val();
    socket.emit('message', { message: message }, function (data) {
      // clear the input
      if (data == 'received') {
        $message.val('');
        $sendButton.removeAttr('disabled');
      }
    });
  });
});
