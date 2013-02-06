$(function () {
  var socket = io.connect("http://porchetta.herokuapp.com/");

  socket.on("error", function(error) {
    console.log(error);
  });

  socket.on("status", function(data) {
    console.log(data.status);
  });

  socket.on("message", function(data) {
    console.log("received", data.message);
    $("ul#chat").append("<li>" + data.message + "</li>");
  });

  var $sendButton = $("#send-button");
  $sendButton.click(function(event) {
    event.preventDefault();
    $sendButton.attr("disabled", "disabled");

    var $input = $("#message");
    var message = $input.val();

    socket.emit("message", { message: message }, function (data) {
      // clear the input
      if (data == "received") {
        $input.val("");
        $sendButton.removeAttr("disabled");
      }
    });
  });
});
