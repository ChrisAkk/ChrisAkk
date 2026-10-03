// music

const btnMusic = document.querySelector('.btn-music');
const ambianceAudio = new Audio('/sons/deepblue.mp3')
ambianceAudio.loop = true;
ambianceAudio.volume = 0.08;
const clickSong = new Audio('/sons/click.mp3')
clickSong.volume = 0.15;

let stateMusic = localStorage.getItem('music-state') || 'pause';
let timeMusic = JSON.parse(localStorage.getItem('music-time')) || 0;

window.addEventListener('pagehide', () => {
    localStorage.setItem('music-time', ambianceAudio.currentTime);
})

if (stateMusic == 'play') {
    ambianceAudio.currentTime = timeMusic;
    ambianceAudio.play();
    btnMusic.innerHTML = '<i class="ri-volume-up-line"></i>';
}

btnMusic.addEventListener('click', () => {
    clickSong.play();

    if (btnMusic.innerHTML === '<i class="ri-volume-mute-line"></i>') {
        ambianceAudio.currentTime = JSON.parse(localStorage.getItem('music-time'))
        ambianceAudio.play();
        btnMusic.innerHTML = '<i class="ri-volume-up-line"></i>';
        stateMusic = 'play'
        localStorage.setItem('music-state', stateMusic);
    } else {
        timeMusic = ambianceAudio.currentTime;
        localStorage.setItem('music-time', timeMusic)
        ambianceAudio.pause();
        btnMusic.innerHTML = '<i class="ri-volume-mute-line"></i>'
        stateMusic = 'pause';
        localStorage.setItem('music-state', stateMusic);
    }
})

// bouton settings

const settings = document.querySelector('.settings');
const settingsBtn = document.querySelector('.settings-btn');

if(settings && settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        clickSong.play();
        settings.classList.toggle('on');
    })
}

// bouton tourne carte

const turnBtn = document.querySelector('.turn-btn');
const backBtn = document.querySelector('.back-btn');
const cards = document.querySelectorAll('.global-card');
const card = document.querySelector('.global-card');

const waveMusic = new Audio('/sons/wave.mp3')
waveMusic.volume = 1,5;

let data;
let isAnimating = false;
let isFlipped = false;
let isClicked = false;

if (turnBtn && card) {
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

if (backBtn && card) {
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

let activeCard = null;

function onStart(e) {
    if (isAnimating) return;

    activeCard = e.currentTarget
    isClicked = true;
    document.body.classList.add('grabbed');
    activeCard.style.transition = 'none';
    data = activeCard.getBoundingClientRect();
}

if (cards) {
    cards.forEach((c) => {
        c.addEventListener('mousedown', onStart)
        c.addEventListener('touchstart', onStart, { passive: true }) 
    })
    
}

function onMove(e) {
    if (isAnimating || !isClicked || !data) return;
    if (!activeCard) return;

    if (!data) {
        activeCard.style.transition = 'none';
        data = activeCard.getBoundingClientRect();
    }

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let ecartX = (clientX - data.left) - (data.width / 2);
    let ecartY = (clientY - data.top) - (data.height / 2);

    let rotateX = -ecartY / 20;
    let rotateY = ecartX / 20;

    if (isFlipped) {
        activeCard.style.transform = `rotateX(${rotateX}deg) rotateY(${180 + rotateY}deg)`
    } else {
        activeCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
} 

window.addEventListener('mousemove', onMove)
window.addEventListener('touchmove', onMove, { passive: false })

function onEnd(e) {
    if (!activeCard) return;
    
    isClicked = false;
    document.body.classList.remove('grabbed');

    activeCard.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';

    if (isFlipped) {
        activeCard.style.transform = `rotateX(0deg) rotateY(180deg)`;
    } else {
        activeCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }

    data = null;
    activeCard = null;
}

window.addEventListener('mouseup', onEnd)
window.addEventListener('touchend', onEnd)

// bulles 

const aquarium = document.querySelector('.aquarium');

window.addEventListener('pageshow', () => {
    if (aquarium) {
        aquarium.innerHTML = '';
        let tab = JSON.parse(localStorage.getItem('bulle')) || []
        if (tab.length > 0) {
            tab.forEach((b) => {
                const bulle = document.createElement('div');
                bulle.classList.add('bulle');
                bulle.style.left = b[0];
                bulle.style.width = b[1];
                bulle.style.height = b[1];
                bulle.style.animationDelay = `-${b[2]}ms`;
                aquarium.appendChild(bulle);
            })
            let i = tab.length;
            generateur(i);
        } else {
            generateur(0);
        }  
    } 
})

window.addEventListener('pagehide', () => {
    const tabBulles = document.querySelectorAll('.bulle');
    let tab = [];
    tabBulles.forEach((b) => {
        let leftBulle = b.style.left;
        let tailleBulle = b.style.width;
        let anim = b.getAnimations()[0];
        let delaybulle = anim.effect.getTiming();
        let animationBulle = anim.currentTime - delaybulle.delay;
        tab.push([leftBulle, tailleBulle, animationBulle]);
    })
    localStorage.setItem('bulle', JSON.stringify(tab));
})

const tailles = ["1px", "2px", "3px", "4px", "5px"]

function generateur(i) {
    let compteur = i;

    const gene = setInterval(() => {
        if (compteur >= 50) {
            clearInterval(gene);
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
}

// Poissons 

const poissons = document.querySelectorAll('.fish');

window.addEventListener('pageshow', () => {
    let tab = JSON.parse(localStorage.getItem('poissons')) || [];
    let i = 0;
    poissons.forEach((poisson) => {
        poisson.style.animationDelay = `${-tab[i]}ms`
        i++;
    })
})

window.addEventListener('pagehide', () => {
    let tab = [];
    poissons.forEach((poisson) => {
        let animPoisson = poisson.getAnimations()[0];
        let delayPoisson = animPoisson.effect.getTiming();
        let agePoisson = animPoisson.currentTime - delayPoisson.delay;
        tab.push(agePoisson);
    })
    localStorage.setItem('poissons', JSON.stringify(tab));
})

// Changement de langue 

const translation = {
    fr: {
        // Pages 

        title: "Étudiant full-stack | Maths & Informatique",
        btnCv: "Télécharger le CV",
        btnContact: 'Me contacter <i class="ri-arrow-turn-forward-line"></i>',
        reseaux: "Me joindre",
        contact: "Mes réseaux",
        portfolio: '<i class="ri-user-fill"></i> Portfolio complet en construction.',
        btnBack: 'Retour <i class="ri-arrow-turn-forward-line"></i>',
        txtEnd: "Portfolio de Chris | V2.0.0",
        quibbler: "Plateforme fan de Harry Potter : quiz, encyclopédie, cartes à collectionner et maisons, hébergée sur mon serveur.",
        hangman: "Un jeu du pendu en ligne : 9 thèmes, difficulté réglable, sons, clavier virtuel et historique des parties.",
        pixora: "Un éditeur photo desktop : luminosité, contraste, flou, sépia, fusion d'images et plus.",
        mesressources: "Site vitrine pour une hypnothérapeute, avec formulaire de contact par e-mail et slider.",
        avis: "Avis",
        projets : "Projets",
        visit: 'Voir le projet <i class="ri-arrow-right-long-fill"></i>',
        avisbtn: '<i class="ri-mail-send-line"></i> Laisser un avis',
        avistitre: 'Vous avez travaillé avec moi ?',

        // Avis

        avis1: '<i class="ri-double-quotes-l"></i> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta exercitationem ipsa quo vero rerum amet dolores at, quidem a odit magni, ut nobis qui voluptate? Fugiat quisquam saepe repudiandae nostrum! <i class="ri-double-quotes-r"></i>'
    },

    en: {
        // Pages 

        title: "Full-stack Student | Maths & Computer Science",
        btnCv: "Download CV",
        btnContact: 'Contact me <i class="ri-arrow-turn-forward-line"></i>',
        reseaux: "Socials",
        contact: "Contact",
        portfolio: ' <i class="ri-user-fill"></i> Full portfolio under construction.',
        btnBack: 'Flip back <i class="ri-arrow-turn-forward-line"></i>',
        txtEnd: "Chris' Portfolio | V2.0.0",
        quibbler: "A Harry Potter fan platform: quizzes, encyclopedia, collectible cards and houses, self-hosted on my own server.",
        hangman: "An online hangman game: 9 themes, adjustable difficulty, sound effects, virtual keyboard and game history.",
        pixora: "A desktop photo editor: brightness, contrast, blur, sepia, image blending and much more.",
        mesressources: "A showcase website for a hypnotherapist, with an email contact form and image slider.",
        avis: "Reviews",
        projets : "Projects",
        visit: 'View project <i class="ri-arrow-right-long-fill"></i>',
        avisbtn: '<i class="ri-mail-send-line"></i> Leave a review',
        avistitre: 'Worked with me?',

        // Avis

        avis1: '<i class="ri-double-quotes-l"></i> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta exercitationem ipsa quo vero rerum amet dolores at, quidem a odit magni, ut nobis qui voluptate? Fugiat quisquam saepe repudiandae nostrum! <i class="ri-double-quotes-r"></i>'

    }
}

const txtAbout = document.querySelector('.about');
const btnCv = document.querySelector('.btn-cv');

function traduire(langue) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
        const cle = el.dataset.i18n;
        el.innerHTML = translation[langue][cle];
    });
}

let langue = localStorage.getItem('langue') || 'en';

traduire(langue);

const btnLangue = document.querySelector('.btn-language');

if (langue == 'fr') {
    btnLangue.innerHTML = '<span class="fi fi-fr"></span>';
} else {
    btnLangue.innerHTML = '<span class="fi fi-us"></span>';
}


btnLangue.addEventListener('click', () => {
    if (langue === 'en') {
        langue = 'fr';
        btnLangue.innerHTML = '<span class="fi fi-fr"></span>';

    } else {
        langue = 'en';
        btnLangue.innerHTML = '<span class="fi fi-us"></span>';
    }
    traduire(langue);
    localStorage.setItem('langue', langue);
});

btnCv?.addEventListener('click', () => {
    clickSong.play();
})

/* bouton tools & bomb bubble

const section = document.querySelectorAll('.tool');
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
*/

// Boutons ancre

const AncreBtn = document.querySelectorAll('a');
if(AncreBtn){
    AncreBtn.forEach((button) => {
        button.addEventListener('click', () => {
            clickSong.play();
        })
    })
}