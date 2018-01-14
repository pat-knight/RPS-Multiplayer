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

//variables
var playerOne = {
        player: false,
        name: "",
        wins: 0,
        losses: 0,
        choice: ""
};
var playerTwo = {
        player: false,
        name: "",
        wins: 0,
        losses: 0,
        choice: ""
};

var gameState = {
        open: 1,
        full: 2
}


database.ref().on("value", function(snapshot){
    console.log(snapshot.val());


    // function (errorObject){
    // console.log(`The read failed ${errorObject.code}`);//print out any errors thrown
    // }
})

$(document).on("click", "#btn-submit", function(){
    if (playerOne.player && playerTwo.player){
        return;
    } else if (!playerOne.player){
        var nameOne = $("#player-name").val().trim();
        playerOne.name = nameOne;
        $("#player-one").text(nameOne)
        playerOne.player = true;
        $("#player-name").val('');
    } else if (!playerTwo.player){
        var nameTwo = $("#player-name").val().trim();
        playerTwo.name = nameTwo;
        $("#player-two").text(nameTwo);
        playerTwo.player= true;
        $("#player-name").val('');
        gameState = 2;
        gameStart();
    }
    database.ref().set({
        playerOne: playerOne,
        playerTwo: playerTwo
    })
});

function gameStart(){
    $(".name-form").hide();//hide name submit area
    $(".name-form").text("Sorry the game is full. Please try again later.");
    var oneRock = $("<button id='oneRock' class='gameButton'>").text("Rock");
    var onePaper = $("<button id='onePaper' class='gameButton'>").text("Paper");
    var oneScissors = $("<button id='oneScissors' class='gameButton'>").text("Scissors");
    var twoRock = $("<button id='twoRock' class='gameButton'>").text("Rock").addClass("twoRock");
    var twoPaper = $("<button id='TwoPaper' calss='gameButton'>").text("Paper").addClass("twoPaper");
    var twoScissors = $("<button id='twoScissors' class='gameButton'>").text("Scissors").addClass("twoScissors");
    $("#player-one").append(oneRock);
    $("#player-one").append(onePaper);
    $("#player-one").append(oneScissors);
    $("#player-two").append(twoRock);
    $("#player-two").append(twoPaper);
    $("#player-two").append(twoScissors);

}

//chat
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

