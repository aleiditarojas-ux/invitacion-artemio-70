
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

// === V6: SOLO DE ABAJO HACIA ARRIBA ===
document.addEventListener('DOMContentLoaded', function(){
  var items = document.querySelectorAll('.vertical-reveal, .vertical-item');

  if(!('IntersectionObserver' in window)){
    return;
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('animate-up');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.10, rootMargin:'0px 0px -24px 0px'});

  items.forEach(function(el){
    observer.observe(el);
  });
});


// V8: animation remains vertical only; galleries use native horizontal touch scrolling.
document.addEventListener('DOMContentLoaded', function(){
  var galleryItems = document.querySelectorAll('.memory-card,.solo-slide,.timeline-item');
  if(!('IntersectionObserver' in window)) return;
  var o = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('animate-up');
        o.unobserve(entry.target);
      }
    });
  }, {threshold:.08, rootMargin:'0px 0px -20px 0px'});
  galleryItems.forEach(function(el){ o.observe(el); });
});

// ===== V9: RAÍCES, FAMILIA, TIMELINE Y VIAJE =====
document.addEventListener('DOMContentLoaded', function(){
  function autoCinema(selector, activeClass, interval){
    var slides = Array.prototype.slice.call(document.querySelectorAll(selector));
    if(slides.length < 2) return;
    var index = 0;
    setInterval(function(){
      slides[index].classList.remove(activeClass);
      index = (index + 1) % slides.length;
      slides[index].classList.add(activeClass);
    }, interval);
  }

  autoCinema('.roots-frame', 'roots-frame-active', 5000);
  autoCinema('.solo-cinema-slide', 'solo-cinema-active', 4800);

  var familyCards = document.querySelectorAll('.family-scroll-reveal');
  if('IntersectionObserver' in window){
    var familyObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('family-in');
          familyObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.18, rootMargin:'0px 0px -40px 0px'});
    familyCards.forEach(function(card){ familyObserver.observe(card); });
  }else{
    familyCards.forEach(function(card){ card.classList.add('family-in'); });
  }

  var timeline = document.getElementById('lifeTimeline');
  var fill = document.getElementById('timelineFill');
  var steps = document.querySelectorAll('.timeline-step');

  function updateTimeline(){
    if(!timeline || !fill) return;
    var rect = timeline.getBoundingClientRect();
    var viewport = window.innerHeight || document.documentElement.clientHeight;
    var start = viewport * .75;
    var end = viewport * .22;
    var total = rect.height + start - end;
    var passed = start - rect.top;
    var progress = Math.max(0, Math.min(1, passed / total));
    fill.style.height = (progress * 100) + '%';
    steps.forEach(function(step){
      var r = step.getBoundingClientRect();
      if(r.top < viewport * .82){
        step.classList.add('timeline-visible');
      }
    });
  }

  updateTimeline();
  window.addEventListener('scroll', updateTimeline, {passive:true});
  window.addEventListener('resize', updateTimeline);
});

// V12: aparición vertical de las fotos de SU FAMILIA
document.addEventListener('DOMContentLoaded', function(){
  var cards = Array.prototype.slice.call(document.querySelectorAll('.family-story-card'));
  if(!cards.length) return;
  cards.forEach(function(card){
    card.classList.remove('family-in');
    card.classList.add('family-v12-pending');
  });
  if(!('IntersectionObserver' in window)){
    cards.forEach(function(card){
      card.classList.remove('family-v12-pending');
      card.classList.add('family-v12-visible');
    });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.remove('family-v12-pending');
        entry.target.classList.add('family-v12-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.16, rootMargin:'0px 0px -35px 0px'});
  cards.forEach(function(card){ observer.observe(card); });
});

// ===== V13: DESTELLOS PLATEADOS SUTILES =====
document.addEventListener('DOMContentLoaded', function(){
  var layer = null;
  if(!layer) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  function createSparkle(){
    var el = document.createElement('span');
    el.className = 'silver-sparkle' + (Math.random() > .72 ? ' sparkle-star' : '');
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.setProperty('--drift', ((Math.random() * 40) - 20) + 'px');
    el.style.animationDuration = (7 + Math.random() * 6) + 's';
    el.style.animationDelay = (Math.random() * .8) + 's';
    layer.appendChild(el);

    setTimeout(function(){
      if(el && el.parentNode) el.parentNode.removeChild(el);
    }, 14000);
  }

  // Pocos destellos para mantener elegancia y rendimiento.
  for(var i=0;i<7;i++){
    setTimeout(createSparkle, i * 700);
  }
  setInterval(createSparkle, 1800);
});
