document.addEventListener('DOMContentLoaded',function(){
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav ul');
  btn && btn.addEventListener('click',()=>{
    document.body.classList.toggle('nav-open');
  });
  
  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        // always reveal the parent element itself
        el.classList.add('active');
        // stagger children if present
        if(el.querySelectorAll){
          const children = el.querySelectorAll('.reveal');
          if(children.length > 1){
            children.forEach((c,i)=>{
              c.style.transitionDelay = (i * 80) + 'ms';
              c.classList.add('active');
            });
          }
        }
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.12});
  reveals.forEach(r => io.observe(r));

  // Parallax mouse move on hero
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  if(hero && heroImage){
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImage.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
    });
    hero.addEventListener('mouseleave', ()=>{ heroImage.style.transform = 'translateY(-10px)'; });
  }

  // Brand/logo entrance
  const brand = document.querySelector('.brand');
  if(brand) setTimeout(()=> brand.classList.add('visible'), 200);

  // Modal for news previews
  const modal = document.getElementById('modal');
  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalMeta = modal.querySelector('.modal-meta');
  const modalText = modal.querySelector('.modal-text');
  const modalClose = modal.querySelector('.modal-close');

  function openModal(card){
    const img = card.querySelector('.news-img').src;
    const title = card.querySelector('.news-head').textContent;
    const excerpt = card.querySelector('.news-excerpt').textContent;
    const author = card.dataset.author || 'Admin';
    const date = card.dataset.date || '';
    modalImg.src = img;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalMeta.textContent = `By ${author} • ${date}`;
    modalText.textContent = excerpt + ' — Read full article on our blog.';
    modal.setAttribute('aria-hidden','false');
  }

  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  document.querySelectorAll('.read-more').forEach(btn=>{
    btn.addEventListener('click', e => {
      const card = e.target.closest('.news-card');
      if(card) openModal(card);
    })
  });
  modalClose.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  // Close modal with Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
      if(document.body.classList.contains('nav-open')) document.body.classList.remove('nav-open');
    }
  });

  // Ensure nav state resets on resize
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 900 && document.body.classList.contains('nav-open')){
      document.body.classList.remove('nav-open');
    }
  });

  // Move decorative floats into sections so they stay within their section (not fixed to viewport)
  (function distributeDecoratives(){
    const globalDecor = document.querySelector('.decoratives');
    if(!globalDecor) return;
    const imgNodes = Array.from(globalDecor.querySelectorAll('img.decorative'));
    const srcs = imgNodes.map(i=>i.src);
    const sections = ['.hero','.about','.benefits','.activities','.enroll','.team','.news','.site-footer'];
    sections.forEach((sel, idx)=>{
      const sec = document.querySelector(sel);
      if(!sec) return;
      // ensure positioned container
      if(getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
      const wrap = document.createElement('div');
      wrap.className = 'decoratives-section';
      wrap.setAttribute('aria-hidden','true');
      // create between 2 and 4 floats per section
      const count = 2 + (idx % 3);
      for(let i=0;i<count;i++){
        const img = document.createElement('img');
        img.className = 'decorative';
        img.src = srcs[(idx + i) % srcs.length];
        // random position inside section
        const left = Math.round(Math.random()*80)+5;
        const top = Math.round(Math.random()*70)+5;
        const size = 30 + Math.round(Math.random()*60);
        const dur = 8 + Math.round(Math.random()*8);
        img.style.left = left + '%';
        img.style.top = top + '%';
        img.style.width = size + 'px';
        img.style.setProperty('--dur', dur + 's');
        img.style.opacity = 0.95;
        wrap.appendChild(img);
      }
      sec.appendChild(wrap);
    });
    // remove the original global container
    globalDecor.parentNode && globalDecor.parentNode.removeChild(globalDecor);
  })();

  // About section background carousel (cross-fade)
  (function initAboutCarousel(){
    const aboutBg = document.querySelector('.about-bg');
    if(!aboutBg) return;
    const slides = Array.from(aboutBg.querySelectorAll('img'));
    if(slides.length === 0) return;
    let idx = 0;
    // ensure initial state
    slides.forEach((s,i)=>{
      s.classList.remove('visible');
      s.style.transition = 'opacity 1s ease-in-out, transform 8s linear';
    });
    slides[0].classList.add('visible');
    // cycle
    const interval = 5000;
    setInterval(()=>{
      slides[idx].classList.remove('visible');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('visible');
    }, interval);
  })();
});
