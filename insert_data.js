const userListRef = firebase.database().ref('UserList')

let addList =()=>{
    var title = document.getElementById('toDoInput').value

    const currentUser = firebase.auth().currentUser;
    userListRef.child(currentUser.uid).push({
        title:title,
    })
    alert('Added List')
    document.getElementById('toDoInput').value = ''
}