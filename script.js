
document.addEventListener('DOMContentLoaded', async () => {
  try {
    music.volume = 0.26;
    await music.play();
    setMusicUI(true);
  } catch (e) {
    // Muchos navegadores bloquean autoplay con sonido.
    // El botón ♪ queda visible para iniciar la música con un toque.
    setMusicUI(false);
  }
});


const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');

function setMusicUI(playing){
  musicBtn.textContent = playing ? 'Ⅱ' : '♪';
  musicBtn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  musicBtn.setAttribute('title', playing ? 'Pausar música' : 'Reproducir música');
}

async function playMusic(){
  try{
    music.volume = 0.26;
    await music.play();
    setMusicUI(true);
  }catch(e){
    setMusicUI(false);
  }
}



musicBtn.addEventListener('click', async ()=>{
  if(music.paused) await playMusic();
  else{
    music.pause();
    setMusicUI(false);
  }
});

function updateCountdown(){
  const target = new Date('2026-10-17T16:00:00-06:00').getTime();
  const diff = Math.max(0, target - Date.now());
  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
  Object.entries(values).forEach(([id,value])=>{
    const el = document.getElementById(id);
    if(el) el.textContent = String(value).padStart(2,'0');
  });
}
updateCountdown();
setInterval(updateCountdown,1000);

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const revealCardObserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealCardObserver.unobserve(entry.target);
    }
  });
},{threshold:.16});
document.querySelectorAll('.reveal-card').forEach(el=>revealCardObserver.observe(el));

const messageFormV4 = document.getElementById('messageForm');
const thanksModalV4 = document.getElementById('thanksModal');
const closeThanksV4 = document.getElementById('closeThanks');

function showThanksV4(){
  if(!thanksModalV4) return;
  thanksModalV4.classList.add('open');
  thanksModalV4.setAttribute('aria-hidden','false');
}
function hideThanksV4(){
  if(!thanksModalV4) return;
  thanksModalV4.classList.remove('open');
  thanksModalV4.setAttribute('aria-hidden','true');
}
if(messageFormV4){
  messageFormV4.addEventListener('submit', ()=>{
    setTimeout(()=>{
      showThanksV4();
      messageFormV4.reset();
    },450);
  });
}
if(closeThanksV4) closeThanksV4.addEventListener('click',hideThanksV4);
if(thanksModalV4){
  const bd=thanksModalV4.querySelector('.thanks-backdrop');
  if(bd) bd.addEventListener('click',hideThanksV4);
}
