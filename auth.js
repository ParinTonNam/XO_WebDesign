//sign up
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(
  document.querySelector("#modal-signup")
);

function createUser(e) {
  e.preventDefault();
  const email = signupForm["input-email-signup"].value;
  const password = signupForm["input-email-signup"].value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      signupFeedback.style = "color:green";
      signupFeedback.innerHTML = `<i class="bi bi-check-circle-fill"></i>Signup Complete`;
      setTimeout(() => {
        signupModal.hide();
        signupFeedback.innerHTML = ''
        signupForm.reset();
      }, 1000);
      
    })
    .catch((error) => {
      signupFeedback.style = "color:crimson";
      signupFeedback.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i>${error.message}`;
      signupForm.reset();
    });
}

// check user login
firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        // console.log('user', user);
        // getList(user)
    }
    setupUI(user)
})

//logout
const btnLogout = document.querySelector('#btnLogOut')
btnLogout.addEventListener('click',()=>{
    firebase.auth().signOut();
    console.log('Logout Complete')
})

//login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", loginUser);

const loginFeedback = document.querySelector("#feedback-msg-login");
const loginModal = new bootstrap.Modal(
  document.querySelector("#modal-login")
);

function loginUser(e) {
  e.preventDefault();
  const email = loginForm["input-email-login"].value;
  const password = loginForm["input-email-login"].value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      loginFeedback.style = "color:green";
      loginFeedback.innerHTML = `<i class="bi bi-check-circle-fill"></i>login Complete`;
      setTimeout(() => {
        loginModal.hide();
        loginForm.reset();
        loginFeedback.innerHTML= ''
      }, 1000);
    })
    .catch((error) => {
      loginFeedback.style = "color:crimson";
      loginFeedback.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i>${error.message}`;
      loginForm.reset();
    });
}

// click cancle or close
const btnCancel = document.querySelectorAll('.btn-cancel')
btnCancel.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        signupForm.reset()
        loginForm.reset()
        loginFeedback.innerHTML= ''
        signupFeedback.innerHTML = ''
    })
})