const loginfrom = document.querySelector("#login-form");
loginfrom.addEventListener("submit", loginUser);

function loginUser(event){
    event.preventDefault();
    const email = loginfrom["input-email-login"].value;
    const password = loginfrom["input-password-login"].value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        console.log('AlreadLogin!!!');
        window.location.href="page_main.html";
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

const goregpage = document.querySelector("#register-page");
goregpage.addEventListener("click", regpage);

function regpage(){
    window.location.href="register.html";
}