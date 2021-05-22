const db = firebase.firestore(),
    auth = firebase.auth(),
    signInBtn = document.querySelector('#signin'),
    signOutBtn = document.querySelector('#signOut')
    chat = document.querySelector('.res'),
    form = document.querySelector('.msgInput'),
    formMsgInput = form.querySelector('#theMsg'),
    timestamp = firebase.firestore.FieldValue.serverTimestamp;
var provider = new firebase.auth.GoogleAuthProvider();

var personName = null;
signInBtn.addEventListener('click', ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(e => {
        personName = e.user.email;
        updateWhenSignStatusChanges();
        console.log(` Hello ${e.additionalUserInfo.profile.name} and `);
        console.log(e);
    }).catch(e=>{
        console.log(e);
        document.querySelector('#theMsg').value = e.toString();
    });
});


window.addEventListener('DOMContentLoaded', ()=>{
});


db.collection('chat').orderBy('createdAt').onSnapshot((docs) => {
    var y = "";
    docs.forEach((doc) => {
        y += matchUserMsgs(personName , doc.data().sender, doc.data().msg);
    });
    chat.innerHTML = y;
    chat.querySelectorAll('div')[(chat.querySelectorAll('div').length - 1)].scrollIntoView();
});


function updateWhenSignStatusChanges(){
/*     db.collection('chat').orderBy('createdAt').get().then((docs) => {
        var y = "";
        docs.forEach((doc) => {
            y += matchUserMsgs(personName , doc.data().sender, doc.data().msg);
        });
        chat.innerHTML = y;
        chat.querySelectorAll('div')[(chat.querySelectorAll('div').length - 1)].scrollIntoView();
    }).catch(e=>{console.log(e)}); */
    db.collection('chat').orderBy('createdAt').onSnapshot((docs) => {
        var y = "";
        docs.forEach((doc) => {
            y += matchUserMsgs(personName , doc.data().sender, doc.data().msg);
        });
        chat.innerHTML = y;
        chat.querySelectorAll('div')[(chat.querySelectorAll('div').length - 1)].scrollIntoView();
    });
}

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    var value = formMsgInput.value;
    var repvalue = value.replaceAll(" ", "");
    if(repvalue !== ""){
        addMsg(value);
    }
});
function addMsg(theM){
    if(personName !== null){
        db.collection('chat').add({"sender":personName, "msg":theM, "createdAt": timestamp()}).catch(e =>{console.log(e)});
    }
        document.querySelector('#theMsg').value = personName;
};

formMsgInput.onfocus = () => {
    formMsgInput.onkeypress =  e => {
        if(e.code == "Enter"){
            addMsg();
        }
    }
};


// functio to kill all the document inside collection chat
function killThemBro(){
    db.collection('chat').get().then(docs => {
        docs.forEach(doc => {
            db.collection('chat').doc(doc.id).delete();
        });
    });
}




// function to select the user msgs and make it as his msgs
function matchUserMsgs(personName, sender, msg){
    var result = "";
    if(personName !== null){
        if(personName == sender){
            result = `<div class="mineMsg"><p>${msg}</p></div>`;
        }else{
            result = `<div><small class="nameofSender">${sender}</small><p>${msg}</p></div>`;

        }
    }else{
        result = `<div><small class="nameofSender">${sender}</small><p>${msg}</p></div>`;
    }
    return result;
}
