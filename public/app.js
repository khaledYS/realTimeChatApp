const db = firebase.firestore();
const chat = document.querySelector('.res');
const form = document.querySelector('.msgInput');
const formMsgInput = form.querySelector('#theMsg');
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

var personName = "";

window.addEventListener('DOMContentLoaded', ()=>{
    personName = prompt("Please enter your name");
    // personName = personName.replaceAll(" ", "");
    console.log(personName);
});


db.collection('chat').orderBy('createdAt').onSnapshot((docs) => {
    var y = "";
    docs.forEach((doc) => {
        y += matchUserMsgs(personName , doc.data().sender, doc.data().msg);
    });
    chat.innerHTML = y;
    chat.querySelectorAll('div')[(chat.querySelectorAll('div').length - 1)].scrollIntoView();
});


form.addEventListener("submit", (e)=>{
    e.preventDefault();
    var value = formMsgInput.value;
    addMsg(value);
});
function addMsg(theM){
    db.collection('chat').add({sender:personName, msg:theM, createdAt: timestamp()});
    document.querySelector('#theMsg').value = "";
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
    var Name = new RegExp(personName, "i");
    var x = sender.search(Name);
    if(x >= 0){
        result = `<div class="mineMsg"><p>${msg}</p></div>`;
    }else{
        result = `<div><small class="nameofSender">${sender}</small><p>${msg}</p></div>`;
    }
    return result;
}
