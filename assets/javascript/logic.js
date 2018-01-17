
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
    database.ref("/players/").remove();
};
//variables

//references
var players = database.ref().child("players");
// var playerKeys = players.keys;
var playerOne = null;
var playerTwo = null;
var userOne = "";
var userTwo = "";
var turn = 1;



var activeUser = {};

var gameState = {
        open: 1,
        full: 2,
        half: 3,
        complete: 4
};

var chatRoom = [];

//sync value changes
database.ref().on("value", function(snapshot){
    console.log(snapshot.val());


    // function (errorObject){
    // console.log(`The read failed ${errorObject.code}`);//print out any errors thrown
    // }
});

players.on("child_added", snap => 
    console.log(snap.val())
);

$(document).on("click", "#btn-submit", function(){
    event.preventDefault();

    players.once("value").then(function(snapshot) {

    if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()){
        return;

    } else if ($("#player-name").val().trim() === "") {
        alert("Please enter a valid user name");

    }  else if (!snapshot.child("playerOne").exists()){
        var name = $("#player-name").val().trim();
        $("#player-one").text(name)
        $("#player-name").val('');//clear form
        database.ref("/players/playerOne").set({//create player object
            name: name,
            position: 1,
            wins: 0,
            losses: 0,
            choice: ""
        });
        var joined = name + " has joined the chat!";
        database.ref("/players/turn").set(turn);
        database.ref("/chat/").push(joined);
        
    } else if (!snapshot.child("playerTwo").exists()){
        var name = $("#player-name").val().trim();
        $("#player-two").text(name);
        $("#player-name").val('');//clear form
        database.ref("/players/playerTwo").set({//create player object
            name: name,
            position: 2,
            wins: 0,
            losses: 0,
            choice: ""
        });
        var joined = name + " has joined the chat!";
        database.ref("/chat/").push(joined);
        gameStart();
        
    }
    // database.ref().set({
    //     playerOne: playerOne,
    //     playerTwo: playerTwo
    })
});

database.ref("/players").on("value", function(snapshot){
    if (snapshot.child("playerOne").exists()){
        playerOne = snapshot.val().playerOne;
        userOne = playerOne.name;
        var playerOneScore = $("<div class='scoreboard'>").text(`Wins: ${playerOne.wins} Losses:${playerOne.losses}`);
        $("#player-one").append(playerOneScore);        
    } 

    if (snapshot.child("playerTwo").exists()){
        playerTwo = snapshot.val().playerTwo;
        userTwo = playerTwo.name;
        var playerTwoScore = $("<div class='scoreboard'>").text(`Wins: ${playerTwo.wins} Losses:${playerTwo.losses}`);
        $("#player-two").append(playerTwoScore);        
    }

    if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists() && turn === 1){
        $(".field").text(`Waiting for selection from ${playerOne.name}`);
    } 

    else if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists() && turn === 2){
        $(".field").text(`Waiting for selection from ${playerOne.name}`);
        }
    });

function gameStart(){
    $(".name-form").hide();//hide name submit area
    $(".name-form").text("Sorry the game is full. Please try again later.");//not working
    makeButtons();
    };


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

$(document).on("click", ".gameButton", function(){// event handler for game buttons
    var selection = $(this).text().trim();
    console.log(selection);

    // if ()

});

function compare(){

}
//chat
// function joinChat(){
// var joined =  activeUser.name + " has joined the chat!";
// database.ref("/chat/").push(joined);
// };

$("#send-message").on("click", function(){
    event.preventDefault();
    var messageText = $("#message").val().trim();
    var message = (`${name}: ${messageText}`);
    database.ref("/chat/").push(message);
    // scrollToBottom()
    $("#message").val("");
});

// function scrollToBottom() {
//     $("#message-display").scrollTop = 1500;
//   };

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

