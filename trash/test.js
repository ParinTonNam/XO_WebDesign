const gameRef = firebase.database().ref("Game");

// เลือกปุ่มจอยเกม
const btnJoins = document.querySelectorAll(".btn-join");

btnJoins.forEach((btnJoin) => btnJoin.addEventListener("click", joinGame));

function joinGame(event) {

    const currentUser = firebase.auth().currentUser;
    console.log("[Join] Current user", currentUser);
    if (currentUser) {
        const btnJoinID = event.currentTarget.getAttribute("id");
        const player = btnJoinID[btnJoinID.length - 1];

        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == "") {
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            gameRef.child("game-1").update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email
            });
            console.log("==============================");
            console.log(currentUser.email + " added.");
            event.currentTarget.disabled = true;
        }
    }
}

const tablePlay = document.querySelectorAll(".table-col");

gameRef.on("value", (snapshot) => {
    getGameInfo(snapshot);
})

// let arrayX = [];
// let arrayO = [];



function getGameInfo(snapshot) {
    document.getElementById("inputPlayer-x").value = "";
    document.getElementById("inputPlayer-o").value = "";
    document.querySelector("#btnJoin-o").disabled = false;
    document.querySelector("#btnJoin-x").disabled = false;
    document.querySelector("#btnCancel-x").disabled = false;
    document.querySelector("#btnCancel-o").disabled = false;
    document.querySelector("#btnStartGame").disabled = true;
    document.querySelector("#btnTermiateGame").disabled = true;

    const btnCancel = document.querySelectorAll(".btn-cancel-join-game");
    btnCancel.forEach((btn) => btn.disabled = false);
    tablePlay.forEach((item) => item.removeEventListener("click", clickResult));
    let gameStart = false;

    snapshot.forEach((data) => {
        const gameInfo = data.val();
        const currentUser = firebase.auth().currentUser;
        Object.keys(gameInfo).forEach((key) => {
            switch (key) {
                case "user-x-email":
                    document.getElementById("inputPlayer-x").value = gameInfo[key];
                    if (currentUser.email == gameInfo[key]) {
                        document.querySelector("#btnJoin-o").disabled = true;
                        document.querySelector("#btnCancel-o").disabled = true;
                    }
                    break;
                case "user-o-email":
                    document.getElementById("inputPlayer-o").value = gameInfo[key];
                    if (currentUser.email == gameInfo[key]) {
                        document.querySelector("#btnJoin-x").disabled = true;
                        document.querySelector("#btnCancel-x").disabled = true;
                    }
                    break;
                case "zone-play-status":
                    console.log(document.getElementById("inputPlayer-x").value)

                    if (gameInfo[key] == "Playing") {
                        gameStart = true;

                        document.querySelector("#btnStartGame").disabled = true;
                        document.querySelector("#btnTermiateGame").disabled = false;

                        tablePlay.forEach((item) => item.addEventListener("click", clickResult));

                        btnCancel.forEach((btn) => btn.disabled = true);
                        break;
                    }
                    if (gameInfo[key] == "X-win") {
                        gameStart = true;
                        document.querySelector("#btnTermiateGame").disabled = false;
                        btnCancel.forEach((btn) => btn.disabled = true);
                        document.getElementById("game-status").innerHTML = "WINNER: X";
                        if (currentUser.email == document.getElementById("inputPlayer-x").value) {
                            console.log("==============================");
                            console.log("Add 3 Scores to X");
                            updateScoreList(3);
                        }
                        break;
                    }
                    if (gameInfo[key] == "O-win") {
                        gameStart = true;
                        document.querySelector("#btnTermiateGame").disabled = false;
                        btnCancel.forEach((btn) => btn.disabled = true);
                        document.getElementById("game-status").innerHTML = "WINNER: O";
                        if (currentUser.email == document.getElementById("inputPlayer-o").value) {
                            console.log("==============================");
                            console.log("Add 3 Scores to O");
                            updateScoreList(3);
                        }
                        break;
                    }
                    if (gameInfo[key] == "draw") {
                        gameStart = true;
                        document.querySelector("#btnTermiateGame").disabled = false;
                        btnCancel.forEach((btn) => btn.disabled = true);
                        document.getElementById("game-status").innerHTML = "GAME DRAW";
                        updateScoreList(1);
                        break;
                    }
                case "current_turn":
                    if (gameInfo[key] == "X") {
                        document.getElementById("game-status").innerHTML = "Turn: X";
                        break;
                    }
                    if (gameInfo[key] == "O") {
                        document.getElementById("game-status").innerHTML = "Turn: O";
                        break;
                    }
                case "row-1-col-1":
                    document.querySelector("#row-1-col-1").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-1-col-2":
                    document.querySelector("#row-1-col-2").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-1-col-3":
                    document.querySelector("#row-1-col-3").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-2-col-1":
                    document.querySelector("#row-2-col-1").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-2-col-2":
                    document.querySelector("#row-2-col-2").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-2-col-3":
                    document.querySelector("#row-2-col-3").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-3-col-1":
                    document.querySelector("#row-3-col-1").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-3-col-2":
                    document.querySelector("#row-3-col-2").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
                case "row-3-col-3":
                    document.querySelector("#row-3-col-3").children[0].innerHTML = `${gameInfo[key]}`;
                    break;
            }
        })
    })

    if (document.getElementById("inputPlayer-x").value != "") {
        document.querySelector("#btnJoin-x").disabled = true;
    }
    if (document.getElementById("inputPlayer-o").value != "") {
        document.querySelector("#btnJoin-o").disabled = true;
    }

    if (document.getElementById("inputPlayer-x").value != "" && document.getElementById("inputPlayer-o").value != "" && !gameStart) {
        document.querySelector("#btnStartGame").disabled = false;
        document.getElementById("game-status").innerHTML = "Click START GAME";
    }

    if (document.getElementById("game-status").innerHTML == "Turn: X") {
        // gameRef.child("game-1").update({
        //     ["played-x"]: arrayX,
        // })
        console.log("==============================");
        console.log("X's Turn");
    }
    if (document.getElementById("game-status").innerHTML == "Turn: O") {
        // gameRef.child("game-1").update({
        //     ["played-o"]: arrayO,
        // })
        console.log("==============================");
        console.log("O's Turn");
    }
}

const btnCancelJoins = document.querySelectorAll(".btn-cancel-join-game");
btnCancelJoins.forEach((btnCancel) => btnCancel.addEventListener("click", cancelJoin));

function cancelJoin(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("==============================");
    console.log("[Cancel] Current user:", currentUser);

    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute("id");
        const player = btnCancelID[btnCancelID.length - 1];

        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.email) {
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            gameRef.child("game-1").child(tmpID).remove();
            gameRef.child("game-1").child(tmpEmail).remove();
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }
    }

    document.getElementById("game-status").innerHTML = "Waiting for players...";
}

const btnStartGame = document.querySelector("#btnStartGame");
btnStartGame.addEventListener("click", startGame);

function startGame() {
    console.log("Starting game");
    gameRef.child("game-1").update({
        ["zone-play-status"]: "Playing",
        ["current_turn"]: "X",
    })
    gameRef.child("game-1").update({
        ["row-1-col-1"]: "-",
        ["row-1-col-2"]: "-",
        ["row-1-col-3"]: "-",
        ["row-2-col-1"]: "-",
        ["row-2-col-2"]: "-",
        ["row-2-col-3"]: "-",
        ["row-3-col-1"]: "-",
        ["row-3-col-2"]: "-",
        ["row-3-col-3"]: "-",
    })
}

function clickResult(event) {
    const tableClicked = event.currentTarget.getAttribute("id");
    const currentUser = firebase.auth().currentUser;
    gameRef.child("game-1").once("value").then((snapshot) => {
        // console.log(snapshot.val().turn)
        if (snapshot.val().current_turn == "X" && currentUser.email == document.getElementById("inputPlayer-x").value) {
            if (document.getElementById(tableClicked).children[0].innerHTML == "-") {
                console.log("==============================");
                console.log("X at", tableClicked);
                // tableClicked.push();
                // arrayX.push(tableClicked);
                // console.log(arrayX);
                gameRef.child("game-1").update({
                    [tableClicked]: "X",
                })
                gameRef.child("game-1").update({
                    ["current_turn"]: "O",
                })
                // event.currentTarget.removeEventListener("click", clickResult);
                console.log(tableClicked, "is Used.");
                checkResult(snapshot.val().current_turn);
            }
            console.log("==============================");
            console.log(tableClicked, "is Used.");

        }
        if (snapshot.val().current_turn == "O" && currentUser.email == document.getElementById("inputPlayer-o").value) {
            if (document.getElementById(tableClicked).children[0].innerHTML == "-") {
                console.log("==============================");
                console.log("O at", tableClicked);
                // arrayO.push(tableClicked);
                // console.log(arrayO);
                gameRef.child("game-1").update({
                    // ["played"]: tableClicked,
                    [tableClicked]: "O",
                })
                gameRef.child("game-1").update({
                    ["current_turn"]: "X",
                })
                console.log(tableClicked, "is Used.");
                checkResult(snapshot.val().current_turn);
            }
            console.log("==============================");
            console.log(tableClicked, "is Used.");
        }
    })
}

const btnEndGame = document.querySelector("#btnTermiateGame");
btnEndGame.addEventListener("click", endGame);

function endGame() {
    console.log("==============================");
    console.log("Ending game");
    // tablePlay.forEach((item) => item.children.innerHTML = "-");
    gameRef.child("game-1").child("zone-play-status").remove();
    gameRef.child("game-1").child("current_turn").remove();
    gameRef.child("game-1").child("played").remove();
    gameRef.child("game-1").update({
        ["row-1-col-1"]: "-",
        ["row-1-col-2"]: "-",
        ["row-1-col-3"]: "-",
        ["row-2-col-1"]: "-",
        ["row-2-col-2"]: "-",
        ["row-2-col-3"]: "-",
        ["row-3-col-1"]: "-",
        ["row-3-col-2"]: "-",
        ["row-3-col-3"]: "-",
    })
}

function checkResult(turn) {
    let hwin = 0;
    let rwin = 0;
    let drawPoint = 0;
    //row
    for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
            // console.log(document.getElementById(`row-${row}-col-${col}`))
            if (document.getElementById(`row-${row}-col-${col}`).children[0].innerHTML == turn) {
                hwin++
                drawPoint++
            }
        }
        if (hwin == 3) {
            console.log("==============================");
            console.log(turn, "WIN")
            gameRef.child("game-1").update({
                ["zone-play-status"]: `${turn}-win`,
            })
        }
        hwin = 0;
    }
    //col
    for (let col = 1; col <= 3; col++) {
        for (let row = 1; row <= 3; row++) {
            // console.log(document.getElementById(`row-${row}-col-${col}`))
            if (document.getElementById(`row-${row}-col-${col}`).children[0].innerHTML == turn) {
                rwin++
                drawPoint++
            }
        }
        if (rwin == 3) {
            console.log("==============================");
            console.log(turn, "WIN")
            gameRef.child("game-1").update({
                ["zone-play-status"]: `${turn}-win`,
            })
        }
        rwin = 0;
    }
    if (document.getElementById("row-1-col-1").children[0].innerHTML == turn &&
        document.getElementById("row-2-col-2").children[0].innerHTML == turn &&
        document.getElementById("row-3-col-3").children[0].innerHTML == turn) {
        console.log("==============================");
        console.log(turn, "WIN");
        gameRef.child("game-1").update({
            ["zone-play-status"]: `${turn}-win`,
        })
    }
    if (document.getElementById("row-1-col-3").children[0].innerHTML == turn &&
        document.getElementById("row-2-col-2").children[0].innerHTML == turn &&
        document.getElementById("row-3-col-1").children[0].innerHTML == turn) {
        console.log("==============================");
        console.log(turn, "WIN");
        gameRef.child("game-1").update({
            ["zone-play-status"]: `${turn}-win`,
        })
    }
    gameRef.child("game-1").once("value").then((snapshot) => {
        if (drawPoint >= 9 && snapshot.val().status == "Playing") {
            console.log("==============================");
            console.log("Game Draw");
            gameRef.child("game-1").update({
                ["zone-play-status"]: "draw",
            })
        }
    })

}