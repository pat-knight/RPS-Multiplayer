 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAP1uWVNAkf27MDW91pfy1K83-PoNmLNns",
    authDomain: "rps-multiplayer-26026.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-26026.firebaseio.com",
    projectId: "rps-multiplayer-26026",
    storageBucket: "rps-multiplayer-26026.appspot.com",
    messagingSenderId: "703791195712"
  };

  firebase.initializeApp(config);

//   variable to reference database
var database = firebase.database();

window.onload = function(){
    $("#message-display").empty();
    database.ref("/chat/").remove();
};
//variables
var playerOne = {
        player: false,
        name: "",
        wins: 0,
        losses: 0,
        choice: "",
        position: null,
        // activeUser: false
};
var playerTwo = {
        player: false,
        name: "",
        wins: 0,
        losses: 0,
        choice: "",
        position: null,
        // activeUser: false
};

activeUser = {};

var gameState = {
        open: 1,
        full: 2
}

var chatRoom = [];


database.ref().on("value", function(snapshot){
    console.log(snapshot.val());


    // function (errorObject){
    // console.log(`The read failed ${errorObject.code}`);//print out any errors thrown
    // }
});

$(document).on("click", "#btn-submit", function(){
    if (playerOne.player && playerTwo.player){
        return;
    } else if ($("#player-name").val().trim() === "") {
        alert("Please enter a valid user name");
    }  else if (!playerOne.player){
        var nameOne = $("#player-name").val().trim();
        playerOne.name = nameOne;
        $("#player-one").text(nameOne)
        playerOne.player = true;
        $("#player-name").val('');
        activeUser = playerOne;
        joinChat();
    } else if (!playerTwo.player){
        var nameTwo = $("#player-name").val().trim();
        playerTwo.name = nameTwo;
        $("#player-two").text(nameTwo);
        playerTwo.player= true;
        $("#player-name").val('');
        gameState = 2;
        gameStart();
        activeUser = playerTwo;
        joinChat();
    }
    database.ref().set({
        playerOne: playerOne,
        playerTwo: playerTwo
    })
});

function gameStart(){
    $(".name-form").hide();//hide name submit area
    $(".name-form").text("Sorry the game is full. Please try again later.");//not working
    makeButtons();
    var playerOneScore = $("<div class='scoreboard'>").text(`Wins: ${playerOne.wins} Losses:${playerOne.wins}`);
    var playerTwoScore = $("<div class='scoreboard'>").text(`Wins: ${playerTwo.wins} Losses:${playerTwo.wins}`);
    $("#player-one").append(playerOneScore);
    $("#player-two").append(playerTwoScore);
}

function makeButtons() {
    var buttonDivOne = $("<div class='playerButtons' id='pb1'>");
    var buttonDivTwo = $("<div class='playerButtons' id='pb2'>");
    var oneRock = $("<button id='oneRock' class='gameButton'>").text(" Rock").prepend($("<i class='fa fa-hand-rock-o' aria-hidden='true'>"));
    var onePaper = $("<button id='onePaper' class='gameButton'>").text(" Paper").prepend($("<i class='fa fa-hand-paper-o' aria-hidden='true'>"));
    var oneScissors = $("<button id='oneScissors' class='gameButton'>").text(" Scissors").prepend($("<i class='fa fa-hand-scissors-o' aria-hidden='true'>"));
    var twoRock = $("<button id='twoRock' class='gameButton'>").text(" Rock").addClass("twoRock").prepend($("<i class='fa fa-hand-rock-o' aria-hidden='true'>"));
    var twoPaper = $("<button id='TwoPaper' class='gameButton'>").text(" Paper").addClass("twoPaper").prepend($("<i class='fa fa-hand-paper-o' aria-hidden='true'>"));
    var twoScissors = $("<button id='twoScissors' class='gameButton'>").text(" Scissors").addClass("twoScissors").prepend($("<i class='fa fa-hand-scissors-o' aria-hidden='true'>"));
    $("#player-one").append(buttonDivOne);
    $("#player-two").append(buttonDivTwo);
    $("#pb1").append(oneRock);
    $("#pb1").append(onePaper);
    $("#pb1").append(oneScissors);
    $("#pb2").append(twoRock);
    $("#pb2").append(twoPaper);
    $("#pb2").append(twoScissors);
};

// $(document).on("click", ".gameButtom", function(){ event handler for game buttons
//     var choice = $(this).id;

//     if ()

// });
//chat
function joinChat(){
var joined =  activeUser.name + " has joined the chat!";
database.ref("/chat/").push(joined);
};

$("#send-message").on("click", function(){
    event.preventDefault();
    // var  activeUser = $("#activeUser").val();
    var messageText = $("#message").val().trim();
    var message = (`${activeUser.name}: ${messageText}`);

    chatRoom.push({
        "activeUser": activeUser,
        "message": message
    });

    $("#send-message").val("");
    database.ref("/chat/").set(chatRoom);
});

database.ref("/chat/").on("child_added", function(snapshot) {
	var messages = snapshot.val();
	console.log(messages);
	$("#message-display").append(messages + "<br>");
});
// function sendMessage(){
//     ref = database().ref("/Chat");
//     messageField = document.querySelector("#message");

//     ref.push().set({
//         name: firebase.currentUser.name,
//         message: messageField.value
//     });
// }

// ref = database().ref("/Chat");
// ref.on("child_added", function(snapshot){
//     var text = snapshot.val();
//     sendMessage(message.name, message.message);
// });

