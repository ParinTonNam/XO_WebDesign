
const gameRef = firebase.database().ref("playerList");
const tbody = document.getElementById('tbody1');
function AddItemToTable(name, winrate, totalwin) {
    let trow = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    td1.innerHTML = name;
    td2.innerHTML = winrate + '%';
    td3.innerHTML = totalwin + " Matches";

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);

    tbody.appendChild(trow);
}

const dbRef = firebase.database().ref("playerList");
dbRef.on("value", (snapshot) => {
    const gameInfo = snapshot.val();
    console.log(gameInfo);

    let allplayer = [];

    Object.keys(gameInfo).forEach((key) => {
        console.log(gameInfo[key]["email"]);
        let allwin = gameInfo[key]["win"];
        let alllose = gameInfo[key]["lose"];
        let winrate = parseInt((allwin / (allwin + alllose)) * 100);
        let email = gameInfo[key]["email"];
        allplayer.push([email, winrate, allwin]);
        console.log(gameInfo[key]["email"]);
        console.log(winrate);
        console.log(gameInfo[key]["win"]);
    });
    allplayer.sort((a, b) => b[2] - a[2]);
    allplayer.forEach(item=> {
        AddItemToTable(item[0], item[1], item[2]);
    });
    console.log(allplayer);
});

// function GetAllDataOnce() {
// 	const dbRef = firebase.database().ref("playerList");

// 	get(child(dbRef, "PlayerList"))
// 		.then((snapshot) => {
// 			var player = [];

// 			snapshot.forEach(childSnapshot => {
// 				player.push(childSnapshot.val());
// 			});

// 			AddAllItemsToTable(players);
// 		});
// }

// window.onload = GetAllDataOnce;