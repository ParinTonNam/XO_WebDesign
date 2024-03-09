const signupform = document.querySelector("#signup-form");
signupform.addEventListener("submit", signUser);
const nameList = firebase.database().ref("playerList");

function signUser(event) {
    event.preventDefault();
    const email = signupform["input-email-signup"].value;
    const password = signupform["input-password-signup"].value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            nameList.child(user.uid).update({
                email: user.email,
                round: 0,
                win: 0,
                lose: 0,
                exp: 0
            });
        }
        console.log('AlreadCreateUser!!!');
        window.location.href = "index.html";
    })
        .catch((error) => {
            console.log(error);
        })
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
    } else {
        console.log("Unavailble User");
    }
})



