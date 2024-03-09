const gameRef = firebase.database().ref("LobbyPlay");

const tablePlay = document.querySelectorAll(".table-col");

gameRef.on("value", (snapshot) => {
    getGameInfo(snapshot);
})

function getGameInfo(snapshot) {
  // document.getElementById("inputPlayer-x").value = "";
  // document.getElementById("inputPlayer-o").value = "";
  // document.querySelector("#btnJoin-o").disabled = false;
  // document.querySelector("#btnJoin-x").disabled = false;
  // document.querySelector("#btnCancel-x").disabled = false;
  // document.querySelector("#btnCancel-o").disabled = false;
  // document.querySelector("#btnStartGame").disabled = true;
  // document.querySelector("#btnTermiateGame").disabled = true;

  // const btnCancel = document.querySelectorAll(".btn-cancel-join-game");
  // btnCancel.forEach((btn) => btn.disabled = false);
  tablePlay.forEach((item) => item.removeEventListener("click", clickResult));
  let gameStart = false;

  snapshot.forEach((data) => {
      const gameInfo = data.val();
      const currentUser = firebase.auth().currentUser;
      Object.keys(gameInfo).forEach((key) => {
          switch (key) {
              // case "user-x-email":
              //     document.getElementById("inputPlayer-x").value = gameInfo[key];
              //     if (currentUser.email == gameInfo[key]) {
              //         document.querySelector("#btnJoin-o").disabled = true;
              //         document.querySelector("#btnCancel-o").disabled = true;
              //     }
              //     break;
              // case "user-o-email":
              //     document.getElementById("inputPlayer-o").value = gameInfo[key];
              //     if (currentUser.email == gameInfo[key]) {
              //         document.querySelector("#btnJoin-x").disabled = true;
              //         document.querySelector("#btnCancel-x").disabled = true;
              //     }
              //     break;
              case "zone-play-status":
                  console.log(document.getElementById("inputPlayer-x").value)

                  if (gameInfo[key] == "Playing") {
                      gameStart = true;

                      // document.querySelector("#btnStartGame").disabled = true;
                      // document.querySelector("#btnTermiateGame").disabled = false;

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

startGame();

function startGame(){
  console.log("Starting game");
  gameRef.child("Lobby1").update({
      ["status"]: "Playing",
      ["turn"]: "X"
  })
  gameRef.child("Lobby1").update({
      ["row-1-col-1"]: "-",
      ["row-1-col-2"]: "-",
      ["row-1-col-3"]: "-",
      ["row-2-col-1"]: "-",
      ["row-2-col-2"]: "-",
      ["row-2-col-3"]: "-",
      ["row-3-col-1"]: "-",
      ["row-3-col-2"]: "-",
      ["row-3-col-3"]: "-"
  })
}

function clickResult(event) {
      // เอาไอดีที่คลิกมา
  console.log("กดติดแล้ว");
  const tableClicked = event.currentTarget.getAttribute("id");
      // ดึงข้อมูล user
  const currentUser = firebase.auth().currentUser;
  console.log(tableClicked);
  // gameRef.child("Lobby1").once("value").then((snapshot) => {
  //     console.log(snapshot.val().turn);

  //     // ถ้า Turn เป็น X
  //     if (snapshot.val().turn == "X") {
  //         if (document.getElementById(tableClicked).children[0].innerHTML == "-") {
  //             console.log("==============================");
  //             console.log("X at", tableClicked);
  //             // tableClicked.push();
  //             // arrayX.push(tableClicked);
  //             // console.log(arrayX);
  //             gameRef.child("Lobby1").update({
  //                 [tableClicked]: "X",
  //             })
  //             gameRef.child("Lobby1").update({
  //                 ["turn"]: "O",
  //             })
  //             // event.currentTarget.removeEventListener("click", clickResult);
  //             console.log(tableClicked, "is Used.");
  //             checkResult(snapshot.val().turn);
  //         }
  //         console.log("==============================");
  //         console.log(tableClicked, "is Used.");

  //     }
  //     if (snapshot.val().turn == "O") {
  //         if (document.getElementById(tableClicked).children[0].innerHTML == "-") {
  //             console.log("==============================");
  //             console.log("O at", tableClicked);
  //             // arrayO.push(tableClicked);
  //             // console.log(arrayO);
  //             gameRef.child("Lobby1").update({
  //                 // ["played"]: tableClicked,
  //                 [tableClicked]: "O",
  //             })
  //             gameRef.child("Lobby1").update({
  //                 ["turn"]: "X",
  //             })
  //             console.log(tableClicked, "is Used.");
  //             checkResult(snapshot.val().turn);
  //         }
  //         console.log("==============================");
  //         console.log(tableClicked, "is Used.");
  //     }
  // })
}
















































// var turn = 'O';
// // var destroy_value = false;
// var destroy_1 = false; //ทำลายตัวเอง
// var destroy_2 = false; //ทำลายอีกฝั่ง 1
// var destroy_3 = false; //ทำลายอีกฝั่ง 2
// var win = false;
// var winner = '';
// var blocks = document.querySelectorAll('.table-block');
// var turnObject = document.getElementById('turn');
// // var winObject = document.getElementById('turn');
// var ble_1 = false; //ทำลายตัวเอง
// var ble_2 = false; //ทำลายอีกฝั่ง 1
// var tub_value = false;

// newGame();

// for (var block of blocks) {
//   // Check click event on each block
//   block.onclick = function (event) { 
//         if (win != true && destroy_1 == false && destroy_2 == false && destroy_3 == false && ble_1 == false && tub_value == false) {
//             if (event.target.innerHTML == '') {
//               event.target.innerHTML = turn;
//               checkResult();
//             }
//           }

// //   ลงเบิ้ล
//     if (win != true && ble_1 == true) {
//         event.target.innerHTML = turn;
//         console.log('วางตัวแรก');
//         ble_1 = false;
//         ble_2 = true;
//         // checkResult();
//       }
//     if (win != true && ble_2 == true && event.target.innerHTML == '') {
//         console.log('วางตัวสอง');
//         event.target.innerHTML = turn;
//         ble_2 = false;
//         checkResult();
//     }


//     // ทำลาย
//     if (win != true && destroy_1 == true) {

//       if (turn == 'X' && event.target.innerHTML == 'X') {
//         console.log('ทำลาย X');
//         event.target.innerHTML = '';
//         destroy_1 = false;
//         destroy_2 = true;
//       }
//       if (turn == 'O' && event.target.innerHTML == 'O') {
//         console.log('ทำลาย O');
//         event.target.innerHTML = '';
//         destroy_1 = false;
//         destroy_2 = true;
//       }
//     }
//     if (win != true && destroy_2 == true) {

//       if (turn == 'X' && event.target.innerHTML == 'O') {
//         console.log('ทำลาย O ครั้งที่ 1');
//         event.target.innerHTML = '';
//         destroy_2 = false;
//         destroy_3 = true;
//       }
//       if (turn == 'O' && event.target.innerHTML == 'X') {
//         console.log('ทำลาย X ครั้งที่ 1');
//         event.target.innerHTML = '';
//         destroy_2 = false;
//         destroy_3 = true;
//       }
//     }
//     if (win != true && destroy_3 == true) {

//       if (turn == 'X' && event.target.innerHTML == 'O') {
//         console.log('ทำลาย O ครั้งที่ 2');
//         event.target.innerHTML = '';
//         destroy_3 = false;
//         checkResult();
//       }
//       if (turn == 'O' && event.target.innerHTML == 'X') {
//         console.log('ทำลาย X ครั้งที่ 2');
//         event.target.innerHTML = '';
//         destroy_3 = false;
//         checkResult();
//       }
//     }

//     // วางทับ
//     if (win != true && tub_value == true){
//       if (turn =='X' && event.target.innerHTML == 'O'&& tub_value == true){    
//             console.log('เปลี่ยนเป็น X');
//             event.target.innerHTML = turn;
//             tub_value = false;
//             checkResult();
//         }
//         if (turn =='O' && event.target.innerHTML == 'X'&& tub_value == true){  
//           console.log('เปลี่ยนเป็น O');        
//             event.target.innerHTML = turn;
//             tub_value = false;
//             checkResult();
//         }
//     }


//   }
// }

// function checkResult() {
//   // Check whether someone wins the game
//   let a0 = document.getElementById('row-1-col-1').innerText;
//   let a1 = document.getElementById('row-1-col-2').innerText;
//   let a2 = document.getElementById('row-1-col-3').innerText;
//   let b0 = document.getElementById('row-2-col-1').innerText;
//   let b1 = document.getElementById('row-2-col-2').innerText;
//   let b2 = document.getElementById('row-2-col-3').innerText;
//   let c0 = document.getElementById('row-3-col-1').innerText;
//   let c1 = document.getElementById('row-3-col-2').innerText;
//   let c2 = document.getElementById('row-3-col-3').innerText;

//   if (((a0 == a1) && (a0 == a2) && (a0 != '')) ||
//     ((b0 == b1) && (b0 == b2) && (b0 != '')) ||
//     ((c0 == c1) && (c0 == c2) && (c0 != '')) ||
//     ((a0 == b0) && (a0 == c0) && (a0 != '')) ||
//     ((a1 == b1) && (a1 == c1) && (a1 != '')) ||
//     ((a2 == b2) && (a2 == c2) && (a2 != '')) ||
//     ((a0 == b1) && (a0 == c2) && (a0 != '')) ||
//     ((a2 == b1) && (a2 == c0) && (a2 != ''))) {
//     // Game end and someone wins the game
//     win = true;
//     winner = turn;
//     turnObject.innerHTML = "Game win by " + winner;
//   } else if ((a0 != '') && (a1 != '') && (a2 != '') &&
//     (b0 != '') && (b1 != '') && (b2 != '') &&
//     (c0 != '') && (c1 != '') && (c2 != '')) {
//     // Game end and no-one wins the game
//     turnObject.innerHTML = "Game draw";
//   } else {
//     // The game is ongoing
    
//     turn = turn === 'O' ? 'X' : 'O';
//     console.log(turn)
//     turnObject.innerHTML = "Turn: " + turn;
//   }
// }

// function newGame() {
//   turn = 'O';
//   turnObject.innerHTML = "Turn: " + turn;
//   winner = '';
//   win = false;
//   // Reset the game to initial state
//   document.getElementById('row-1-col-1').innerHTML = '';
//   document.getElementById('row-1-col-2').innerHTML = '';
//   document.getElementById('row-1-col-3').innerHTML = '';
//   document.getElementById('row-2-col-1').innerHTML = '';
//   document.getElementById('row-2-col-2').innerHTML = '';
//   document.getElementById('row-2-col-3').innerHTML = '';
//   document.getElementById('row-3-col-1').innerHTML = '';
//   document.getElementById('row-3-col-2').innerHTML = '';
//   document.getElementById('row-3-col-3').innerHTML = '';
// }

// function destroy() {
//   // Loop through each block and allow placing a marker on the opponent's marker
//   console.log("จะทำลายแล้วนะ");
//   destroy_1 = true;
// }

// function double() {
//     console.log("จะเบิ้ลแล้วนะ");
//     ble_1 = true;
// }

// function tub() {
//     // Loop through each block and allow placing a marker on the opponent's marker
//     console.log("จะทับแล้วนะ");
//     tub_value = true;
// }






// // กดดูสกิล
// // Get the modal
// var modal = document.getElementById("myModal");

// // Get the first image and insert it inside the modal - use its "alt" text as a caption
// var img = document.getElementById("myImg");
// var img2 = document.getElementById("myImg2");
// var img3 = document.getElementById("myImg3");
// var img4 = document.getElementById("myImg4"); // รับองค์ประกอบของภาพที่สอง
// var modalImg = document.getElementById("img01");
// var captionText = document.getElementById("caption");

// var img_1 = document.createElement('img');
// img_1.src = ("images/skill/des_skill1.png");
// var img_2 = document.createElement('img');
// img_2.src = ("images/skill/des_skill2.png");
// var img_3 = document.createElement('img');
// img_3.src = ("images/skill/des_skill3.png");
// var img_4 = document.createElement('img');
// img_4.src = ("images/skill/des_skill4.png");


// img.onclick = function () {
//   modal.style.display = "block";
//   modalImg.src = img_1.src; // รูปแรก
//   captionText.innerHTML = this.alt;
// }

// // img2.onclick = function () {
// //   modal.style.display = "block";
// //   modalImg.src = img_2.src; // รูปที่สอง
// //   captionText.innerHTML = this.alt;
// // }

// // img3.onclick = function () {
// //   modal.style.display = "block";
// //   modalImg.src = img_3.src; // รูปที่สาม
// //   captionText.innerHTML = this.alt;
// // }

// // img4.onclick = function () {
// //   modal.style.display = "block";
// //   modalImg.src = img_4.src; // รูปที่สี่
// //   captionText.innerHTML = this.alt;
// // }

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//   modal.style.display = "none";
// }