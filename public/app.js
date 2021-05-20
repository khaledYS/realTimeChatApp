const db = firebase.firestore();
const chat = document.querySelector('.res');
const form = document.querySelector('.msgInput');
const timestamp = firebase.firestore.FieldValue.serverTimestamp;



window.addEventListener('DOMContentLoaded', ()=>{
    personName = prompt("Please enter your name");
    personName = personName.replace(/ /g, "");
});



db.collection('chat').orderBy('createdAt').onSnapshot((docs) => {
    var y = "";
    docs.forEach((doc) => {
        y += matchUserMsgs(personName , doc.data().sender, doc.data().msg);
    });
    chat.innerHTML = y;
    chat.querySelectorAll('span')[(chat.querySelectorAll('span').length - 1)].scrollIntoView();
});


form.querySelector('#submit').addEventListener("click", e => {
    var theM = form.theMsg.value;
    db.collection('chat').add({sender:personName, msg:theM, createdAt: timestamp()});
    document.querySelector('#theMsg').value = "";
});



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
        result = `<div class="mineMsg"><span >${msg}</span></div>`;
    }else{
        result = `<div><span><span>${sender}</span><span> ${msg}</span></span></div>`;
    }
    return result;
}
