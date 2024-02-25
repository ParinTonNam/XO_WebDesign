// บอก firebase ว่านี่คือ gamenode
const gameRef = firebase.database().ref("Game");

// เลือกทุกปุ่มด้วย class .btn-join
const btnJoins = document.querySelectorAll(".btn-join");
// ใส่ event listener
btnJoins.forEach((btn) => {
  btn.addEventListener("click", joinGame);
});

// function สำหรับจัดการการกดปุ่ม join game
function joinGame(e) {
  const currentUser = firebase.auth().currentUser;
  console.log("[Join] Current user", currentUser);
  if (currentUser) {
    const btnJoinID = e.currentTarget.getAttribute("id");
    // get id ปุ่มที่ถูกกด
    const player = btnJoinID[btnJoinID.length - 1];
    const playerForm = document.getElementById(`inputPlayer-${player}`);
    // เลือก input ที่เอาไว้แสดงผล

    if (playerForm.value == "") {
      // ถ้า slot ว่าง เอาผู้เล่น current add เข้าไปเลย
      let tmpID = `user-${player}-id`;
      let tmpEmail = `user-${player}-email`;
      // key ที่จะแอด

      // update 'game' node in database
      gameRef.child("game-1").update({
        [tmpID]: currentUser.uid,
        [tmpEmail]: currentUser.email,
        z_status: "wait",
        // เติม z จะได้อ่าน key status หลังอ่าน user
      });
      console.log(currentUser.email + " added");
    }
  }
}

// get all eleemnts with the class 'table-col'
const box = document.querySelectorAll(".table-col");

// firebase database ref for 'score' node
const scoreRef = firebase.database().ref("Score");

// event listener สำหรับเปลี่ยน score node
scoreRef.on("value", (snapshot) => {
  const currentUser = firebase.auth().currentUser;
  snapshot.forEach((data) => {
    if (data.key == currentUser.uid) {
      document.getElementById("user-score").innerHTML = data.val();
      found = true;
      // ถ้าเจอ id ตัวเอง -> update score
    }
  });
});

// function update คะแนนของuser ใน score node
function addScore(score, uid) {
  let oldScore = parseInt(document.getElementById("user-score").innerHTML);
  let newScore = oldScore + score;
  // console.log('old score',oldScore)
  scoreRef.update({
    [uid]: newScore,
  });
}

// event listener ดักฟังการเปลี่ยนแปลงใน 'game' node
gameRef.on("value", (snapshot) => {
  getGameInfo(snapshot);
});

// function รับข้อมูลจากเกม และ update ui ไปเรื่อยๆ
function getGameInfo(snapshot) {
  // code สำหรับ update ข้อมูลใน UI
  document.getElementById("inputPlayer-x").value = "";
  document.getElementById("inputPlayer-o").value = "";
  document.querySelector("#btnJoin-o").disabled = false;
  document.querySelector("#btnJoin-x").disabled = false;
  document.querySelector("#btnStartGame").disabled = true;
  document.querySelector("#btnTerminateGame").disabled = true;
  const btnCancel = document.querySelectorAll(".btn-cancel-join-game");
  btnCancel.forEach((btn) => {
    btn.disabled = false;
  });
  box.forEach((item) => {
    item.removeEventListener("click", selectBox);
  });
  // clear ก่อนจ้า

  snapshot.forEach((data) => {
    const gameInfo = data.val();
    const currentUser = firebase.auth().currentUser;
    let player = 0;

    Object.keys(gameInfo).forEach((key) => {
      switch (key) {
        case "board":
          //แสดงบอดที่มี
          Object.keys(gameInfo[key]).forEach((boxid) => {
            document.getElementById(boxid).innerHTML = gameInfo[key][boxid];
          });
          break;

        case "checked":
          //ยังไม่เชค และมี result แล้ว = บวกคะแนน
          if (!gameInfo[key] && gameInfo["result"]) {
            const winner = `user-${gameInfo["result"]
              .slice(-1)
              .toLowerCase()}-id`;
            if (winner != "user-w-id") {
              // console.log("winer : ", winner);
              const idWinner = gameInfo[winner];
              // คนชนะ +3
              if (currentUser.uid == idWinner) {
                console.log("you win");
                addScore(3, currentUser.uid);
              }
            } else {
              // เสมอ
              addScore(1, currentUser.uid);
            }
            gameRef.child("game-1").update({ ["checked"]: true });
          }
          break;

        case "turn":
          document.getElementById("status").innerHTML = `Turn ${gameInfo[key]}`;
          yourTurn = `user-${gameInfo[key]}-id`;
          if (currentUser.uid == gameInfo[yourTurn]) {
            // console.log(gameInfo[key], " play");
            // enable ปุ่ม ที่ไม่มีค่า
            box.forEach((item) => {
              if (item.innerHTML.length != 1) {
                item.addEventListener("click", selectBox);
              }
            });
          }
          break;

        case "result":
          gameRef.child("game-1").child("turn").remove();
          document.getElementById("status").innerHTML = gameInfo[key];
          break;

        case "user-x-email":
          player++;
          document.querySelector("#btnJoin-x").disabled = true;
          document.getElementById("inputPlayer-x").value = gameInfo[key];
          // ดึง mail จาห database มาใส่ช่อง
          if (
            currentUser.email == document.getElementById("inputPlayer-x").value
          ) {
            document.querySelector("#btnJoin-o").disabled = true;
          }
          // อยู่ x ห้าม join o
          break;

        case "user-o-email":
          document.querySelector("#btnJoin-o").disabled = true;
          document.getElementById("inputPlayer-o").value = gameInfo[key];
          player++;
          if (
            currentUser.email == document.getElementById("inputPlayer-o").value
          ) {
            document.querySelector("#btnJoin-x").disabled = true;
          }
          // อยู่ o ห้าม join x
          break;

        case "z_status":
          if (gameInfo[key] == "start") {
            // มีสถานะเริ่มเล่นแล้ว ห้ามกดเริ่ม กดจบได้
            document.querySelector("#btnStartGame").disabled = true;
            if (currentUser.uid == gameInfo['user-x-id'] || currentUser.uid == gameInfo['user-o-id']) {
              document.querySelector("#btnTerminateGame").disabled = false;
            }

            // ห้าม cancel ตลอดไป
            btnCancel.forEach((btn) => {
              btn.disabled = true;
            });
          }

          if (gameInfo[key] == "wait") {
            if (player == 2) {
              if (currentUser.uid == gameInfo['user-x-id'] || currentUser.uid == gameInfo['user-o-id']) {
                document.querySelector("#btnStartGame").disabled = false;
              }
              document.getElementById("status").innerHTML = "Click START GAME";
            } else {
              document.getElementById("status").innerHTML =
                "Waiting for players...";
            }
          }

          break;
      }
    });
  });
}

// cancel join request
const btnCancelJoins = document.querySelectorAll(".btn-cancel-join-game");
btnCancelJoins.forEach((btn) => {
  btn.addEventListener("click", cancelJoin);
});
function cancelJoin(e) {
  const currentUser = firebase.auth().currentUser;
  console.log("[Cancel] Current user", currentUser);
  if (currentUser) {
    const btnCancelID = e.currentTarget.getAttribute("id");
    // get id ปุ่มที่ถูกกด
    const player = btnCancelID[btnCancelID.length - 1];
    const playerForm = document.getElementById(`inputPlayer-${player}`);
    // เลือก email ในช่อง

    if (playerForm.value && playerForm.value === currentUser.email) {
      // ถ้า email ตรงกับตัวเองถึงให้ cancel
      let tmpID = `user-${player}-id`;
      let tmpEmail = `user-${player}-email`;
      gameRef.child("game-1").child(tmpID).remove();
      gameRef.child("game-1").child(tmpEmail).remove();
      console.log(currentUser.email + " deleted");
      //   clear database laew
    }
  }
}

// function เริ่มเกม
const btnStart = document.querySelector("#btnStartGame");
btnStart.addEventListener("click", startGame);
function startGame(e) {
  // code สำหรับเริ่มเกม
  gameRef.child("game-1").update({
    ["z_status"]: "start",
    ["turn"]: "x",
    ["board"]: {
      "row-1-col-1": "",
      "row-1-col-2": "",
      "row-1-col-3": "",
      "row-2-col-1": "",
      "row-2-col-2": "",
      "row-2-col-3": "",
      "row-3-col-1": "",
      "row-3-col-2": "",
      "row-3-col-3": "",
    },
    ["checked"]: false,
  });
}

// function จัดการ box ที่เลือกใน game grid
function selectBox(e) {
  // code สำหรับ update game ตามการเลือกช่อง
  let id = e.currentTarget.id;
  let val = document.getElementById("status").innerHTML.slice(-1);
  // update value to that box in database
  gameRef
    .child("game-1")
    .child("board")
    .update({
      [id]: val,
    });

  // check winner and update to database

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // create list from board to check
  let listX = [];
  let listO = [];
  let listEmpty = [];
  let isEnd = false;

  document.querySelectorAll(".table-col").forEach((item) => {
    if (item.innerHTML.length == 1) {
      if (item.innerHTML == "x") {
        listX.push(true);
        listO.push(false);
        listEmpty.push(false);
      } else {
        listX.push(false);
        listO.push(true);
        listEmpty.push(false);
      }
    } else {
      listX.push(false);
      listO.push(false);
    }
  });

  // console.log("list x", listX);
  // console.log("list o", listO);
  // console.log("list em", listEmpty);


  // ตรวจสอบ winner
  winPatterns.forEach((line) => {
    // เจอ true 3 ช่อง = win
    // อัพผลใน database สำหรับคนแพ้

    if (listX[line[0]] && listX[line[1]] && listX[line[2]]) {
      gameRef.child("game-1").child("turn").remove();
      gameRef.child("game-1").update({ ["result"]: "Winner : X" });
      console.log("x win");
      isEnd = true;
    } else if (listO[line[0]] && listO[line[1]] && listO[line[2]]) {
      gameRef.child("game-1").child("turn").remove();
      gameRef.child("game-1").update({ ["result"]: "Winner : O" });
      console.log("o win");
      isEnd = true;
    } else if (listEmpty.length == 9) {
      gameRef.child("game-1").child("turn").remove();
      gameRef.child("game-1").update({ ["result"]: "Game Draw" });
      console.log("draw");
      isEnd = true;
    }
  });

  // not end and switch turn
  if (!isEnd) {
    if (val == "x") {
      gameRef.child("game-1").update({
        turn: "o",
      });
    } else if (val == "o") {
      gameRef.child("game-1").update({
        turn: "x",
      });
    }
  }
}

// eventlistener ดังฟังเพื่อจบเกม
const btnEnd = document.querySelector("#btnTerminateGame");
btnEnd.addEventListener("click", endGame);

// function ที่ใช้บึ้มเกม
function endGame(e) {
  // code สำหรับบึ้มเกม
  gameRef.child("game-1").child("result").remove();
  gameRef.child("game-1").update({
    ["z_status"]: "wait",
    ["board"]: {
      "row-1-col-1": "",
      "row-1-col-2": "",
      "row-1-col-3": "",
      "row-2-col-1": "",
      "row-2-col-2": "",
      "row-2-col-3": "",
      "row-3-col-1": "",
      "row-3-col-2": "",
      "row-3-col-3": "",
    },
  });
}
