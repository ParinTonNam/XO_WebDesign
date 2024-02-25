const logoutItem = document.querySelectorAll(".logged-out");
const loginItem = document.querySelectorAll(".logged-in");

let setupUI = (user) => {
  if (user) {
    const dbRef = firebase.database().ref();
    const scoreRef = firebase.database().ref("Score");
    // show score
    dbRef
      .child("Score")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const id = user.uid;
          if (data[id] != null) {
            document.getElementById("user-score").innerHTML = data[id];
            // console.log('ound act point : ', data[id])
          } else {
            // create score 0
            // console.log('new act id : ', id)
            scoreRef.update({
              [id]: 0,
            });
            document.getElementById("user-score").innerHTML = 0;
          }
          // console.log("val", snapshot.val(), "uid", user.uid);
        }
      });
    // show email
    document.querySelector("#user-profile").innerHTML = user.email;
    loginItem.forEach((item) => {
      item.style.display = "block";
    });
    logoutItem.forEach((item) => {
      item.style.display = "none";
    });
  } else {
    loginItem.forEach((item) => {
      item.style.display = "none";
    });
    logoutItem.forEach((item) => {
      item.style.display = "block";
    });
  }
};

var ref = firebase.database().ref("Mylist");

let readList = (snapshot) => {
  document.getElementById("main-content").innerHTML = "";
  // const currentUser = firebase.auth().currentUser;
  // userListRef.child(currentUser.uid).once("value").then((snapshot) => {
  snapshot.forEach((data) => {
    let title = data.val().title;
    let id = data.key;

    const newDiv = `
            <div class="d-flex justify-content-between mb-2">
                <div>
                    <label>${title}</label>
                </div>
                <button class='btn btn-outline-danger' data-id='${id}'><i class="bi bi-trash"></i></button>
            </div>
              `;
    const newElement = document.createRange().createContextualFragment(newDiv);
    document.getElementById("main-content").appendChild(newElement);
  });
  document.querySelectorAll(".btn-outline-danger").forEach((btn) => {
    btn.addEventListener("click", deleteList);
  });
  // });
};

let deleteList = (e) => {
  const id = e.currentTarget.dataset.id;
  const currentUser = firebase.auth().currentUser;
  userListRef.child(currentUser.uid).child(id).remove();
  console.log("delete", id);
};

//ดึง list เฉพาะของ user
let getList = (user) => {
  if (user) {
    userListRef.child(user.uid).on("value", (snapshot) => {
      readList(snapshot);
    });
  }
};
