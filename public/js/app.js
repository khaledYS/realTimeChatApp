const db = firebase.firestore(),
    auth = firebase.auth(),
    signInBtn = document.querySelector('#signin'),
    signOutBtn = document.querySelector('#signout'),
    chat = document.querySelector('.res'),
    form = document.querySelector('.msgInput'),
    formMsgInput = form.querySelector('#theMsg'),
    timestamp = firebase.firestore.FieldValue.serverTimestamp,
    fLang = document.querySelector('#favlang'),
    fLangC =  document.querySelector('.custom-select'),
    nonS = document.querySelector('.nonsigned'),
    s = document.querySelector('.signed'),
    head = document.querySelector('#head'),
    welcome = document.querySelector('#head span h3'),
    setting = document.querySelector('#head img'),
    settings = document.querySelector('.settings'),
    settingsClose = document.querySelector('.settings > img');
var provider = new firebase.auth.GoogleAuthProvider();

settingsClose.addEventListener('click', ()=>{
    settings.classList.remove("openedsettings");
});

var personName = null;
signInBtn.addEventListener('click', ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(e => {
        personName = e.user.email;
        updateWhenSignStatusChanges();
        console.log(` Hello ${e.additionalUserInfo.profile.name}`);
        if(localStorage.getItem('favLang') == undefined){
            localStorage.setItem("favLang",fLang.value);
        }
        document.querySelector('#head span h2').innerText = e.additionalUserInfo.profile.name;
        s.style.display = "block";
        nonS.style.display = "none";
    }).catch(e=>{
        console.log(e);
        document.querySelector('#theMsg').value = "";
    });
});

signOutBtn.addEventListener('click', ()=>{
    firebase.auth().signOut();
    nonS.appendChild(fLangC);
    settings.classList.remove("openedsettings");
    s.style.display = "none";
    nonS.style.display = "flex";
});

window.addEventListener('DOMContentLoaded', ()=>{
    if(localStorage.getItem('favLang') != undefined){
        var x = localStorage.getItem("favLang");
        fLang.value = x;
        if(fLang.value == "Arabic"){
            changeIntoArabic();
        }else{
            changeIntoEnglish();
        }
    }
});


fLang.addEventListener('change', ()=>{
    if(fLang.value == "Arabic"){
        changeIntoArabic();
    }else{
        changeIntoEnglish();
    }
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
        document.querySelector('#theMsg').value = "";
};

setting.addEventListener('click', ()=>{
    if(settings.classList.contains("openedsettings")){
        settings.classList.remove("openedsettings");
        nonS.appendChild(fLangC);
    }else{
        settings.classList.add("openedsettings");
        document.querySelector('.settings .accdivs .lang').appendChild(fLangC);
    }
});

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
    msg = msg.replace(/</g, "&lt;");
    msg = msg.replace(/>/g, "&gt;");
    msg = msg.replace(/"/g, "&quot;");
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


function changeIntoArabic(){
    document.querySelector('#head span').style.direction = "rtl";
    document.querySelector('.nonsigned h1').innerText = "سجل الدخول لكي تلتقي بأصدقائك ";
    document.querySelector('.nonsigned button').innerText = "سجل الدخول";
    formMsgInput.setAttribute('placeholder', "قل شيئاً جميلاً ");
    welcome.innerText = "مرحباً";
    localStorage.setItem('favLang', "Arabic");
    document.querySelector('.accnames .acc-account-label').innerText = "الحساب";
    document.querySelector('.accnames .acc-lang-label').innerText = "اللغة";
    document.querySelector('.accdivs .account button span').innerText = "تسجيل الخروج";
}
function changeIntoEnglish() {
    document.querySelector('#head span').style.direction = "ltr";
    document.querySelector('.nonsigned h1').innerText = "sign in to find your friends";
    document.querySelector('.nonsigned button').innerText = "Sign In";
    formMsgInput.setAttribute('placeholder', "say some thing nice");
    welcome.innerText = "Hello Mr";
    localStorage.setItem('favLang', "English");
    document.querySelector('.accnames .acc-account-label').innerText = "Account";
    document.querySelector('.accnames .acc-lang-label').innerText = "Language";
    document.querySelector('.accdivs .account button span').innerText = "Log Out";
}
 killThemBro()
