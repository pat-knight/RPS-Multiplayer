
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
var chatroom = database.ref().child("chat");
var active = database.ref("active");
var user = {
    position: "0",
    name: "",
    wins: 0,
    losses: 0,
    turns: 0,
    selection: ""
}

var enemy = {
    position: "0",
    name: "",
    wins: 0,
    losses: 0,
    turns: 0,
    selection: ""
}
// var playerOne = null;
// var playerTwo = null;
var userOne = "";
var userTwo = "";
var state = 1;
var one = "";
var two = "";
var choices = [];
var chatRoom = [];

//sync value changes
database.ref().on("value", function(snapshot){
    console.log(snapshot.val());

});

database.ref("/players/").on("child_added", function(snapshot){
    console.log(snapshot.val())

});

// database.ref("/players/p").on("child_added", function(snapshot){
//     console.log(snap.val())

// });

$(document).on("click", "#btn-submit", function(){
    event.preventDefault();

    players.once("value").then(function(snapshot) {

    if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()){
        gameStart();
        alert("sorry, the game is full.")
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
            selection: null
        });
        var joined = name + " has joined the chat!";
        database.ref("/players/state").set(state);
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
            selection: null
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
    if (snapshot.child("playerOne").exists() && userOne === "" && state === 1){
        playerOne = snapshot.val().playerOne;
        userOne = playerOne.name;
        var playerOneScore = $("<div class='scoreboard'>").text(`Wins: ${playerOne.wins} Losses:${playerOne.losses}`);
        $("#player-one").append(playerOneScore);        
    } 

    if (snapshot.child("playerTwo").exists() && userTwo === "" && state === 1){
        playerTwo = snapshot.val().playerTwo;
        userTwo = playerTwo.name;
        var playerTwoScore = $("<div class='scoreboard'>").text(`Wins: ${playerTwo.wins} Losses:${playerTwo.losses}`);
        $("#player-two").append(playerTwoScore);        
    }

    if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists() && state === 1){
        $(".field").text(`Waiting for selection from ${playerTwo.name}`);
    } 

    else if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists() && state === 2){
        $(".field").text(`Waiting for selection from ${playerOne.name}`);
        }
    });

function gameStart(){
    $(".name-form").hide();//hide name submit area
    makeButtons();
    };


function makeButtons() {
    var buttonDivOne = $("<div class='playerButtons' id='pb1'>");
    var buttonDivTwo = $("<div class='playerButtons' id='pb2'>");
    var oneRock = $("<button data-id='oneRock' class='gameButtonOne'>").text(" Rock").prepend($("<i class='fa fa-hand-rock-o' aria-hidden='true'>"));
    var onePaper = $("<button data-id='onePaper' class='gameButtonOne'>").text(" Paper").prepend($("<i class='fa fa-hand-paper-o' aria-hidden='true'>"));
    var oneScissors = $("<button data-id='oneScissors' class='gameButtonOne'>").text(" Scissors").prepend($("<i class='fa fa-hand-scissors-o' aria-hidden='true'>"));
    var twoRock = $("<button data-id='twoRock' class='gameButtonTwo'>").text(" Rock").addClass("twoRock").prepend($("<i class='fa fa-hand-rock-o' aria-hidden='true'>"));
    var twoPaper = $("<button data-id='TwoPaper' class='gameButtonTwo'>").text(" Paper").addClass("twoPaper").prepend($("<i class='fa fa-hand-paper-o' aria-hidden='true'>"));
    var twoScissors = $("<button data-id='twoScissors' class='gameButtonTwo'>").text(" Scissors").addClass("twoScissors").prepend($("<i class='fa fa-hand-scissors-o' aria-hidden='true'>"));
    $("#player-one").append(buttonDivOne);
    $("#player-two").append(buttonDivTwo);
    $("#pb1").append(oneRock);
    $("#pb1").append(onePaper);
    $("#pb1").append(oneScissors);
    $("#pb2").append(twoRock);
    $("#pb2").append(twoPaper);
    $("#pb2").append(twoScissors);
};

$(document).on("click", ".gameButtonOne", function(){// event handler for game buttons
    if (state === 1){
    
    var selection = $(this).text().trim();
    var selectString = JSON.stringify(selection);    
    console.log("player one: " + selectString);
    database.ref("/players/p1").push(selection);
    $("#pb1").remove();
    $("#player-one").append($("<p>")).text(`You selected ${selection}`);
    $(".field").text(`Waiting for selection from player 2`);
    state === 2;
    }

});

$(document).on("click", ".gameButtonTwo", function(){// event handler for game buttons
    
    
    var selection = $(this).text().trim();
    var selectString = JSON.stringify(selection);
    console.log("player two: " + selectString);
    database.ref("/players/p2").push(selection);
    $("#pb2").remove();
    $("#player-two").append($("<p>")).text(`You selected ${selection}`);
    shoot();
    
});

players.on("child_added", function(snapshot) {
    var one = snapshot.p1;
    var two = snapshot.p2;
    choices.push(one);
    choices.push(two);
})


function shoot(){
    // database.ref("/players/").on("Child_added", function(snapshot) {
    // // var players = snapshot.
    var one = choices[0];
    var two = choices[1];
    // var one = snapshot.child("/players/playerOne/selection").val();
    // var two = snapshot.child("/players/playerTwo/selection").val();
    // var two = playerTwo.selection;
    
    if ((one === "rock") && (two === "paper")){
            database.ref("players/playerOne/losses").set(playerOne.losses ++);
            database.ref("players/playerTwo/wins").set(playerTwo.wins ++);
            $(".field").text(`${playerTwo.name} Wins!`);
            playAgain();
            return
        }  
            else if ((one === "rock") && (two === "scissors")) {
            database.ref("players/playerTwo/losses").set(playerTwo.losses ++);
            database.ref("players/playerOne/wins").set(playerOne.wins ++);
            $(".field").text(`${playerOne.name} Wins!`);
            playAgain();
            return;

        }   else if ((one === "paper") && (two === "scissors")){
                database.ref("players/playerOne/losses").set(playerOne.losses ++);
                database.ref("players/playerTwo/wins").set(playerTwo.wins ++);
                $(".field").text(`${playerTwo.name} Wins!`);
                playAgain();
                return

            }   else if ((one === "paper") && (two === "rock")) {
                database.ref("players/playerTwo/losses").set(playerTwo.losses ++);
                database.ref("players/playerOne/wins").set(playerOne.wins ++);
                $(".field").text(`${playerOne.name} Wins!`);
                playAgain();
                return;

            } else if ((one === "scissors") && (two === "rock")){
                    database.ref("players/playerOne/losses").set(playerOne.losses ++);
                    database.ref("players/playerTwo/wins").set(playerTwo.wins ++);
                    $(".field").text(`${playerTwo.name} Wins!`);
                    playAgain();
                    return
                }  
                    else if ((one === "scissors") && (two === "paper")) {
                    database.ref("players/playerTwo/losses").set(playerTwo.losses ++);
                    database.ref("players/playerOne/wins").set(playerOne.wins ++);
                    $(".field").text(`${playerOne.name} Wins!`);
                    playAgain();
                    return;
                } else {
                        console.log("tie game");
                        $(".field").text("TIE : /");
                        playAgain();
                        return;
                    };
                }
    // )}

function playAgain(){
    var playerOneScore = $("<div class='scoreboard'>").text(`Wins: ${playerOne.wins} Losses:${playerOne.losses}`);
    $("#player-one").append(playerOneScore);
    var playerTwoScore = $("<div class='scoreboard'>").text(`Wins: ${playerTwo.wins} Losses:${playerTwo.losses}`);
    $("#player-two").append(playerTwoScore); 
    var reset = $("<button id='reset'>").text("Play Again?");
    $(".field").append(reset);
}

$(document).on("click", "#reset", function(){
    $("field").html("");
    database.ref("/players/playerOne/selection").set("");
    database.ref("/players/playerTwo/selection").set("");
    makeButtons();
});


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

