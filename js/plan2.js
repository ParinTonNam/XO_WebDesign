const gameRef = firebase.database().ref("Lobby");

const playerList = firebase.database().ref("playerList");

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
            let tmpHealth = `user-${player}-health`;
            gameRef.child("game-1").update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email,
                [tmpHealth]: 5
            });
            console.log("==============================");
            console.log(currentUser.email + " added.");
            event.currentTarget.disabled = true;

            if (player == "x") {
                gameRef.child("game-1").child("user-x-health").once("value").then((count) => {
                    health_x = count.val();
                    console.log("เข้า x จ้า")
                    // console.log(health_x);
                    document.getElementById("health_x").innerHTML = "Health Players O:" + health_x;
                })
            }
            if (player == "o") {
                gameRef.child("game-1").child("user-o-health").once("value").then((count) => {
                    health_o = count.val();
                    console.log("เข้า o จ้า")
                    // console.log(health_o);
                    document.getElementById("health_o").innerHTML = "Health Players X:" + health_o;
                })
            }
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
    document.querySelector("#btnNextGame").disabled = true;
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
                    // console.log(document.getElementById("inputPlayer-x").value)

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
                        document.querySelector("#btnNextGame").disabled = false;
                        document.getElementById("game-status").innerHTML = "WINNER: X in this Turn";
                        if (currentUser.email == document.getElementById("inputPlayer-x").value) {
                            // console.log("==============================");
                            // console.log("Add 3 Scores to X");
                            // updateScoreList(3);
                        }
                        break;
                    }
                    if (gameInfo[key] == "O-win") {
                        gameStart = true;
                        document.querySelector("#btnTermiateGame").disabled = false;
                        btnCancel.forEach((btn) => btn.disabled = true);
                        document.querySelector("#btnNextGame").disabled = false;
                        document.getElementById("game-status").innerHTML = "WINNER: O in this Turn";
                        if (currentUser.email == document.getElementById("inputPlayer-o").value) {
                            // console.log("==============================");
                            // console.log("Add 3 Scores to O");
                            // updateScoreList(3);
                        }
                        break;
                    }
                    if (gameInfo[key] == "draw") {
                        gameStart = true;
                        document.querySelector("#btnTermiateGame").disabled = false;
                        document.querySelector("#btnNextGame").disabled = false;
                        btnCancel.forEach((btn) => btn.disabled = true);
                        document.getElementById("game-status").innerHTML = "GAME DRAW this Turn";
                        // updateScoreList(1);
                        break;
                    }

                    // เงื่อนไขชนะเกมทั้งหมด

                    if (gameInfo[key] == "xwinAll") {
                        gameStart = true;
                        document.querySelector("#btnTermiateGame").disabled = false;
                        document.querySelector("#btnNextGame").disabled = true;
                        btnCancel.forEach((btn) => btn.disabled = true);
                        document.getElementById("game-status").innerHTML = "X win the Game!!";
                        console.log("x ชนะ")
                        break;
                    }
                    if (gameInfo[key] == "owinAll") {
                        gameStart = true;
                        document.querySelector("#btnTermiateGame").disabled = false;
                        document.querySelector("#btnNextGame").disabled = true;
                        btnCancel.forEach((btn) => btn.disabled = true);
                        document.getElementById("game-status").innerHTML = "O win the Game!!";
                        console.log("o ชนะ")
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
            let tmpHealth = `user-${player}-health`;
            // console.log(tmpHealth);
            gameRef.child("game-1").child(tmpID).remove();
            gameRef.child("game-1").child(tmpEmail).remove();
            gameRef.child("game-1").child(tmpHealth).remove();
            // console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }
    }

    document.getElementById("game-status").innerHTML = "Waiting for players...";
}

const btnNextGame = document.querySelector("#btnNextGame");
btnNextGame.addEventListener("click", nextgame);

// ฟังก์ชันไปรอบต่อไป
function nextgame(event) {
    console.log("==============================");
    console.log("Next Round");

    // tablePlay.forEach((item) => item.children.innerHTML = "-");
    // gameRef.child("game-1").child("user-x-health").val("เริ่มใหม่ๆ");
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
        ["zone-play-status"]: "Playing",

    })
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
    // gameRef.child("game-1").child("user-x-health").val("เริ่มใหม่ๆ");
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
    let damage = "";
    // console.log(turn.toLowerCase())
    // let tmpHealth =`user-${turn}-health` ;
    // console.log(gameRef.child("game-1").val());
    // console.log(gameRef.child("game-1").child(`user-${turn}-health`).val());
    // if (turn = "X"){
    //     damage = "o";
    // }
    // if (turn = "O"){
    //     damage = "x";
    // }
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
            console.log(turn, "WIN แบบ 1")
            gameRef.child("game-1").update({
                ["zone-play-status"]: `${turn}-win`,
                [`user-${turn.toLowerCase()}-health`]: firebase.database.ServerValue.increment(-1),

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
            console.log(turn, "WIN แบบ 2")

            gameRef.child("game-1").update({
                ["zone-play-status"]: `${turn}-win`,
                [`user-${turn.toLowerCase()}-health`]: firebase.database.ServerValue.increment(-1),

            })
        }
        rwin = 0;
    }
    if (document.getElementById("row-1-col-1").children[0].innerHTML == turn &&
        document.getElementById("row-2-col-2").children[0].innerHTML == turn &&
        document.getElementById("row-3-col-3").children[0].innerHTML == turn) {
        console.log("==============================");
        console.log(turn, "WIN แบบ 3");
        // console.log(tmpHealth)
        gameRef.child("game-1").update({
            ["zone-play-status"]: `${turn}-win`,
            [`user-${turn.toLowerCase()}-health`]: firebase.database.ServerValue.increment(-1),
        })
    }
    if (document.getElementById("row-1-col-3").children[0].innerHTML == turn &&
        document.getElementById("row-2-col-2").children[0].innerHTML == turn &&
        document.getElementById("row-3-col-1").children[0].innerHTML == turn) {
        console.log("==============================");
        console.log(turn, "WIN แบบ 4");
        gameRef.child("game-1").update({
            ["zone-play-status"]: `${turn}-win`,
            [`user-${turn.toLowerCase()}-health`]: firebase.database.ServerValue.increment(-1),

        })
    }
    gameRef.child("game-1").once("value").then((snapshot) => {
        if (drawPoint >= 9 && snapshot.val().status == "Playing") {
            console.log("==============================");
            console.log("Game Draw");
            gameRef.child("game-1").update({
                ["zone-play-status"]: "draw",
                [`user-${turn.toLowerCase()}-health`]: firebase.database.ServerValue.increment(-1),
            })
        }
    })

    // ฟังก์ชันอัพเดทเลือด แบบ Hard Code สัสๆ

    if (turn.toLowerCase() == "o") {
        gameRef.child("game-1").child("user-o-health").once("value").then((count) => {
            heal_o = count.val();
            console.log("อัพเดทเลือด X");
            console.log(heal_o);
            document.getElementById("health_o").innerHTML = "Health Players X: " + heal_o;
        })
        gameRef.child("game-1").child("user-x-health").once("value").then((count) => {
            heal_x = count.val();
            console.log("อัพเดทเลือด O");
            console.log(heal_x);
            document.getElementById("health_x").innerHTML = "Health Players O: " + heal_x;
        })
    }

    if (turn.toLowerCase() == "x") {
        gameRef.child("game-1").child("user-x-health").once("value").then((count) => {
            heal_x = count.val();
            console.log("อัพเดทเลือด O");
            console.log(heal_x);
            document.getElementById("health_x").innerHTML = "Health Players O: " + heal_x;
        })
        gameRef.child("game-1").child("user-o-health").once("value").then((count) => {
            heal_o = count.val();
            console.log("อัพเดทเลือด X");
            console.log(heal_o);
            document.getElementById("health_o").innerHTML = "Health Players X: " + heal_o;
        })
    }



    // ถ้า X ชนะในเกมนี้
    gameRef.child("game-1").child("user-o-health").once("value").then((snapshot) => {
        if (snapshot.val() == 0) {
            console.log("==============================");
            console.log("X win in game");
            gameRef.child("game-1").update({
                ["zone-play-status"]: "xwinAll",
            })
            
            gameRef.child("game-1").child("user-x-id").once("value").then((test) =>{
                console.log(test.val());
                playerList.child(test.val()).update({
                            ["lose"]: firebase.database.ServerValue.increment(1),
                        })
            })

            gameRef.child("game-1").child("user-o-id").once("value").then((test) =>{
                console.log(test.val());
                playerList.child(test.val()).update({
                            ["win"]: firebase.database.ServerValue.increment(1),
                        })
            })
            // playerList.child(snapshot.child("user-x-id").once("value").then((data) => {
            //     playerList.child(snapshot.child("user-x-id")).update({
            //         ["win"]: 100,
            //     })
            // }
            // ))
        }
    })


    // ถ้า O ชนะในเกมนี้
    gameRef.child("game-1").child("user-x-health").once("value").then((snapshot) => {
        if (snapshot.val() == 0) {
            console.log("==============================");
            console.log("O win in game");
            gameRef.child("game-1").update({
                ["zone-play-status"]: "owinAll",
            })
            gameRef.child("game-1").child("user-o-id").once("value").then((test) =>{
                console.log(test.val());
                playerList.child(test.val()).update({
                            ["lose"]: firebase.database.ServerValue.increment(1),
                        })
            })

            gameRef.child("game-1").child("user-x-id").once("value").then((test) =>{
                console.log(test.val());
                playerList.child(test.val()).update({
                            ["win"]: firebase.database.ServerValue.increment(1),
                        })
            })
        }
    })



}