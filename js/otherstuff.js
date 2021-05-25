const settings = document.querySelector('.settings'),
        accname = document.querySelector('.settings .accname'),
        accnameC = document.querySelectorAll('.settings .accnames .accname'),
        accdiv = document.querySelector('.settings .accdiv '),
        accdivC = document.querySelectorAll('.settings .accdivs .accdiv');
accnameC.forEach(el =>{
    el.addEventListener('click', e=>{
        if(!e.target.classList.contains('active')){
            accnameC.forEach(element => {
                element.classList.remove('active');
            });
            accdivC.forEach(element => {
                element.classList.remove('active');    
            });
            document.querySelector(`.${e.target.getAttribute("data-to")}`).classList.add('active');
            e.target.classList.add('active');
            console.log(true);
        }
    });
}
)

document.addEventListener('DOMContentLoaded', ()=>{
    var x = document.querySelectorAll('.nonsigned *');
    x.forEach(element => {
        element.classList.add('nonanimated');
    });
});