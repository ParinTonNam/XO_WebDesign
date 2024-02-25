const signupform = document.querySelector("#signup-form");
signupform.addEventListener("submit", signUser);

function signUser(event) {
    event.preventDefault();
    const email = signupform["input-email-signup"].value;
    const password = signupform["input-password-signup"].value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        console.log('AlreadCreateUser!!!');
        window.location.href="index.html";
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



