
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






// === V5.1 MOBILE SAFE + EMAILJS ===
document.addEventListener('DOMContentLoaded', function(){
  var animated = document.querySelectorAll('.section-transition,.reveal,.reveal-card,.reveal-soft');

  // Todo está visible desde CSS; la animación es solo decorativa.
  if ('IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('mobile-animate');
          animObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.06});
    animated.forEach(function(el){ animObserver.observe(el); });
  }

  var form = document.getElementById('messageForm');
  var submit = document.getElementById('messageSubmit');
  var status = document.getElementById('messageStatus');
  var modal = document.getElementById('thanksModal');
  var closeBtn = document.getElementById('closeThanks');
  var timer = null;

  function closeThanks(){
    if(!modal) return;
    if(timer) clearTimeout(timer);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }

  function openThanks(){
    if(!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    if(timer) clearTimeout(timer);
    timer = setTimeout(closeThanks, 5000);
  }

  if(closeBtn){
    closeBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      closeThanks();
    });
  }

  if(modal){
    modal.addEventListener('click', function(e){
      if(e.target && e.target.classList && e.target.classList.contains('thanks-backdrop')){
        closeThanks();
      }
    });
  }

  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();

      var cfg = window.EMAILJS_CONFIG || {};
      if(typeof emailjs === 'undefined' || !cfg.publicKey || !cfg.serviceId || !cfg.templateId){
        if(status){
          status.textContent = 'No se pudo cargar el servicio de mensajes.';
          status.className = 'message-status error';
        }
        return;
      }

      if(submit){
        submit.disabled = true;
        submit.textContent = 'ENVIANDO...';
      }
      if(status){
        status.textContent = 'Enviando tu mensaje...';
        status.className = 'message-status sending';
      }

      try{
        emailjs.init({publicKey:cfg.publicKey});
        await emailjs.sendForm(cfg.serviceId, cfg.templateId, form);
        form.reset();
        if(status){
          status.textContent = '';
          status.className = 'message-status';
        }
        openThanks();
      }catch(err){
        console.error('EmailJS', err);
        if(status){
          status.textContent = 'No pudimos enviar el mensaje. Intenta nuevamente.';
          status.className = 'message-status error';
        }
      }finally{
        if(submit){
          submit.disabled = false;
          submit.textContent = 'ENVIAR MENSAJE';
        }
      }
    });
  }
});
