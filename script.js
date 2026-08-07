
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




// ===== FINAL: TRANSICIONES + EMAILJS =====
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.section-transition,.reveal-soft,.reveal-card');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -30px 0px'});
    targets.forEach((el,i)=>{
      el.style.transitionDelay = `${Math.min(i%4,3)*80}ms`;
      obs.observe(el);
    });
  } else {
    targets.forEach(el=>el.classList.add('visible'));
  }

  const form = document.getElementById('messageForm');
  const submit = document.getElementById('messageSubmit');
  const status = document.getElementById('messageStatus');
  const modal = document.getElementById('thanksModal');
  const close = document.getElementById('closeThanks');

  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }
  if(close) close.addEventListener('click',closeModal);
  if(modal){
    const bd = modal.querySelector('.thanks-backdrop');
    if(bd) bd.addEventListener('click',closeModal);
  }

  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const cfg = window.EMAILJS_CONFIG || {};
      if(!cfg.publicKey || !cfg.serviceId || !cfg.templateId){
        status.textContent='La configuración de mensajes no está disponible.';
        status.className='message-status error';
        return;
      }
      submit.disabled=true;
      submit.textContent='ENVIANDO...';
      status.textContent='Enviando tu mensaje...';
      status.className='message-status sending';
      try{
        emailjs.init({ publicKey: cfg.publicKey });
        await emailjs.sendForm(cfg.serviceId,cfg.templateId,form);
        form.reset();
        status.textContent='';
        status.className='message-status';
        if(modal){
          modal.classList.add('open');
          modal.setAttribute('aria-hidden','false');
        }
      }catch(err){
        console.error(err);
        status.textContent='No pudimos enviar el mensaje. Intenta nuevamente en un momento.';
        status.className='message-status error';
      }finally{
        submit.disabled=false;
        submit.textContent='ENVIAR MENSAJE';
      }
    });
  }
});
