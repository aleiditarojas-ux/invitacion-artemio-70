
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





// ===== REVISIÓN FINAL: TRANSICIONES + EMAILJS + MODAL =====
document.addEventListener('DOMContentLoaded', () => {
  const animated = document.querySelectorAll('.section-transition,.reveal,.reveal-card,.reveal-soft');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible','show');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.1, rootMargin:'0px 0px -20px 0px'});
    animated.forEach((el,i)=>{
      el.style.transitionDelay = `${Math.min(i%4,3)*70}ms`;
      observer.observe(el);
    });
  } else {
    animated.forEach(el=>el.classList.add('visible','show'));
  }

  const form = document.getElementById('messageForm');
  const submit = document.getElementById('messageSubmit');
  const status = document.getElementById('messageStatus');
  const modal = document.getElementById('thanksModal');
  const closeBtn = document.getElementById('closeThanks');

  let autoCloseTimer = null;

  function openThanks(){
    if(!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(closeThanks, 5000);
  }

  function closeThanks(){
    if(!modal) return;
    clearTimeout(autoCloseTimer);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }

  if(closeBtn){
    closeBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      closeThanks();
    });
  }

  if(modal){
    modal.addEventListener('click', (e)=>{
      if(e.target.classList.contains('thanks-backdrop') || e.target.dataset.closeThanks === 'true'){
        closeThanks();
      }
    });
  }

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && modal?.classList.contains('open')) closeThanks();
  });

  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();

      const cfg = window.EMAILJS_CONFIG || {};
      if(!cfg.publicKey || !cfg.serviceId || !cfg.templateId || typeof emailjs === 'undefined'){
        if(status){
          status.textContent='No se pudo cargar el servicio de mensajes.';
          status.className='message-status error';
        }
        return;
      }

      if(submit){
        submit.disabled = true;
        submit.textContent = 'ENVIANDO...';
      }
      if(status){
        status.textContent='Enviando tu mensaje...';
        status.className='message-status sending';
      }

      try{
        emailjs.init({publicKey: cfg.publicKey});
        await emailjs.sendForm(cfg.serviceId, cfg.templateId, form);

        form.reset();
        if(status){
          status.textContent='';
          status.className='message-status';
        }
        openThanks();
      }catch(error){
        console.error('EmailJS:', error);
        if(status){
          status.textContent='No pudimos enviar el mensaje. Intenta nuevamente en un momento.';
          status.className='message-status error';
        }
      }finally{
        if(submit){
          submit.disabled=false;
          submit.textContent='ENVIAR MENSAJE';
        }
      }
    });
  }
});
