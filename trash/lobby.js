const gameRef = firebase.database().ref("LobbyPlay");
const playerList = firebase.database().ref("playerList");
// document.getElementById("start1").addEventListener("click", createRoom);

function createRoom1_x() {
    // เข้าห้องเพื่อหาห้อง
    const user_lobby = firebase.auth().currentUser;
    // เอาผู้เล่นเข้าห้อง
    gameRef.child("Lobby1").once("value").then((lobby_name) => {
        let lobby_key = user_lobby.uid;
        playerList.child(lobby_key).once("value").then((player_1) => {

            let check = lobby_name.child("many_player").val();
            console.log(check);
            gameRef.child("Lobby1").update({
                playerx: user_lobby.email,
                many_player: check + 1
            })
            // document.getElementById("playername").innerHTML = email;
            // window.location.href = "page_preperation.html";
        })
    })

}

function createRoom1_o() {
    // เข้าห้องเพื่อหาห้อง
    const user_lobby = firebase.auth().currentUser;
    // เอาผู้เล่นเข้าห้อง
    gameRef.child("Lobby1").once("value").then((lobby_name) => {
        let lobby_key = user_lobby.uid;
        playerList.child(lobby_key).once("value").then((player_1) => {

            let check = lobby_name.child("many_player").val();
            console.log(check);
            gameRef.child("Lobby1").update({
                playero: user_lobby.email,
                many_player: check + 1
            })
        })
    })
}

gameRef.on("value", (snapshot) => {
    const gameInfo = snapshot.val();
    const currentUser = firebase.auth().currentUser;
    let player = 0;

    Object.keys(gameInfo).forEach((key) => {
        switch (key) {
            case "Lobby1":
                Object.keys(gameInfo[key]).forEach((countPlayer) => {
                    switch (countPlayer) {
                        case "many_player":
                            if (gameInfo[key][countPlayer] == 2){
                                window.location.href = "page_game.html";
                            }
                            console.log(gameInfo[key][countPlayer])
                            break;
                    }
                });
                break;
        }

    });
});




// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//         console.log(user);
//     } else {
//         console.log("Unavailble User");
//     }
// })
