// music

const btnMusic = document.querySelector('.btn-music');
const ambianceAudio = new Audio('/sons/deepblue.mp3')
ambianceAudio.loop = true;
ambianceAudio.volume = 0.08;
const clickSong = new Audio('/sons/click.mp3')
clickSong.volume = 0.15;

btnMusic.addEventListener('click', () => {
    clickSong.play();

    if (btnMusic.innerHTML === '<i class="ri-volume-mute-line"></i>') {
        ambianceAudio.play();
        btnMusic.innerHTML = '<i class="ri-volume-up-line"></i>';
    } else {
        ambianceAudio.pause();
        btnMusic.innerHTML = '<i class="ri-volume-mute-line"></i>'
    }
})

// bouton tourne carte

const turnBtn = document.querySelector('.turn-btn');
const backBtn = document.querySelector('.back-btn');
const card = document.querySelector('.global-card');

const waveMusic = new Audio('/sons/wave.mp3')
waveMusic.volume = 1,5;

let data;
let isAnimating = false;
let isFlipped = false;
let isClicked = false;

if (turnBtn) {
    turnBtn.addEventListener('click', () => {
        card.style.transform = '';
        card.classList.remove('unflipped');
        card.classList.add('flipped');
        waveMusic.currentTime = 0;
        waveMusic.play();

        isAnimating = true;
        setTimeout(() => {
            isFlipped = true;
            card.classList.remove('flipped');
            card.style.transform = 'rotateY(180deg)';
            isAnimating = false;
        }, 1000)
    })
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        card.style.transform = '';
        card.classList.remove('flipped');
        card.classList.add('unflipped');
        waveMusic.currentTime = 0;
        waveMusic.play();

        isAnimating = true;
        setTimeout(() => {
            isFlipped = false;
            card.classList.remove('unflipped');
            card.style.transition = 'none'
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            card.offsetHeight;
            card.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
            isAnimating = false;
        }, 1000)
    })
}

function onStart() {
    if (isAnimating) return;

    isClicked = true;
    document.body.classList.add('grabbed');
    card.style.transition = 'none';
    data = card.getBoundingClientRect();
}

card.addEventListener('mousedown', onStart)
card.addEventListener('touchstart', onStart, { passive: true })

function onMove(e) {
    if (isAnimating || !isClicked || !data) return;

    if (!data) {
        card.style.transition = 'none';
        data = card.getBoundingClientRect();
    }

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let ecartX = (clientX - data.left) - (data.width / 2);
    let ecartY = (clientY - data.top) - (data.height / 2);

    let rotateX = -ecartY / 20;
    let rotateY = ecartX / 20;

    if (isFlipped) {
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${180 + rotateY}deg)`
    } else {
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
}

window.addEventListener('mousemove', onMove)
window.addEventListener('touchmove', onMove, { passive: false })

function onEnd() {
    isClicked = false;
    document.body.classList.remove('grabbed');

    card.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';

    if (isFlipped) {
        card.style.transform = `rotateX(0deg) rotateY(180deg)`;
    } else {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }

    data = null;
}

window.addEventListener('mouseup', onEnd)
window.addEventListener('touchend', onEnd)

// bulles 

const aquarium = document.querySelector('.aquarium');

window.addEventListener('pageshow', (e) => {
    if (aquarium) {
        aquarium.innerHTML = '';
    }
})

const tailles = ["1px", "2px", "3px", "4px", "5px"]
let compteur = 0;

const generateur = setInterval(() => {
    if (compteur >= 50) {
        clearInterval(generateur);
        return;
    }

    const bulle = document.createElement('div');
    bulle.classList.add('bulle')
    bulle.style.left = `${Math.random() * 100}%`
    let indice = Math.floor(Math.random() * tailles.length)
    bulle.style.width = tailles[indice]
    bulle.style.height = tailles[indice]
    aquarium.appendChild(bulle)
    compteur++;

}, 300)

// Changement de langue 

const translation = {
    fr: {
        title: "Étudiant full-stack | Maths & Informatique",
        btnCv: "Télécharger le CV",
        btnContact: 'Me contacter <i class="ri-arrow-turn-forward-line"></i>',
        reseaux: "Me joindre",
        contact: "Mes réseaux",
        portfolio: '<i class="ri-user-fill"></i> Mon portfolio complet arrive bientôt.',
        btnBack: 'Retour <i class="ri-arrow-turn-forward-line"></i>',
        txtEnd: "Carte Virtuelle de Chris | Portfolio à venir"
    },

    en: {
        title: "Full-stack Student | Maths & Computer Science",
        btnCv: "Download CV",
        btnContact: 'Contact me <i class="ri-arrow-turn-forward-line"></i>',
        reseaux: "Socials",
        contact: "Contact",
        portfolio: ' <i class="ri-user-fill"></i> Full portfolio coming soon.',
        btnBack: 'Flip back <i class="ri-arrow-turn-forward-line"></i>',
        txtEnd: "Chris' Virtual Card | Portfolio coming soon"
    }
}

const btnLanguage = document.querySelector('.btn-language');
const languagContainer = document.querySelector('.language-container');

const txtAbout = document.querySelector('.about');
const btnCv = document.querySelector('.btn-cv');
const btnContact = document.querySelector('.turn-btn');
const txtReseau = document.querySelector('.title-reseaux');
const txtContact = document.querySelector('.title-contact');
const txtPortfolio = document.querySelector('.txt-portfolio');
const btnBack = document.querySelector('.back-btn');
const txtEnd = document.querySelector('.txt-end');

btnLanguage.addEventListener('click', () => {
    clickSong.play();

    if (btnLanguage.dataset.lang === "en") {
        btnLanguage.dataset.lang = "fr";

        txtAbout.innerHTML = translation['fr']['title'];
        btnCv.innerHTML = translation['fr']['btnCv'];
        btnContact.innerHTML = translation['fr']['btnContact'];
        txtReseau.innerHTML = translation['fr']['reseaux'];
        txtContact.innerHTML = translation['fr']['contact'];
        txtPortfolio.innerHTML = translation['fr']['portfolio'];
        btnBack.innerHTML = translation['fr']['btnBack'];
        txtEnd.innerHTML = translation['fr']['txtEnd'];

        const notification = document.createElement('div');
        notification.innerHTML = "Français";
        notification.classList.add('notification');

        languagContainer.appendChild(notification);

        notification.addEventListener('animationend', () => {
            notification.remove();
        })

    } else {
        btnLanguage.dataset.lang = "en";

        txtAbout.innerHTML = translation['en']['title'];
        btnCv.innerHTML = translation['en']['btnCv'];
        btnContact.innerHTML = translation['en']['btnContact'];
        txtReseau.innerHTML = translation['en']['reseaux'];
        txtContact.innerHTML = translation['en']['contact'];
        txtPortfolio.innerHTML = translation['en']['portfolio'];
        btnBack.innerHTML = translation['en']['btnBack'];
        txtEnd.innerHTML = translation['en']['txtEnd'];

        const notification = document.createElement('div');
        notification.innerHTML = "English";
        notification.classList.add('notification');

        languagContainer.appendChild(notification);

        notification.addEventListener('animationend', () => {
            notification.remove();
        })

    }
})

btnCv.addEventListener('click', () => {
    clickSong.play();
})

// bouton tools & bomb bubble

const section = document.querySelectorAll('section');
const bombeAudio = new Audio('/sons/bombe.mp3');
const bombeAudio2 = new Audio('/sons/bombe2.mp3');
bombeAudio.playbackRate = 2;
bombeAudio.volume = 0.5;

section.forEach(tool => {
    tool.addEventListener('click', () => {
        bombeAudio2.currentTime = 0;
        bombeAudio2.play();

        setTimeout(() => {
            bombeAudio.currentTime = 0;
            bombeAudio.play();
        }, 1100)

        let compteur2 = 0;

        const generateur2 = setInterval(() => {
            if (compteur2 >= 100) {
                clearInterval(generateur2);
                return;
            }

            const bombe = document.createElement('div');
            bombe.classList.add('bombe');
            bombe.style.left = `${Math.random() * 100}%`;
            let indiceTaille = Math.floor(Math.random() * tailles.length);
            bombe.style.width = tailles[indiceTaille];
            bombe.style.height = tailles[indiceTaille];
            aquarium.appendChild(bombe);
            compteur2++;

            setTimeout(() => {
                bombe.remove();
            }, 3000)
        }, 30)
    })
});
