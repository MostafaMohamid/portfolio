(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- loader ---- */
  window.addEventListener('load', function(){
    setTimeout(function(){ document.getElementById('loader').classList.add('gone'); }, reduce ? 200 : 2000);
  });

  /* ---- cursor ---- */
  var dot = document.getElementById('dot'), ring = document.getElementById('ring');
  var mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
  if (window.matchMedia('(hover:hover)').matches){
    document.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + (mx-3.5) + 'px,' + (my-3.5) + 'px)';
    });
    (function trail(){
      rx += (mx-rx)*0.13; ry += (my-ry)*0.13;
      ring.style.transform = 'translate(' + (rx-19) + 'px,' + (ry-19) + 'px)';
      requestAnimationFrame(trail);
    })();
    var hot = document.querySelectorAll('a,button,.chip,.proj,.job,.card3d');
    for (var h=0; h<hot.length; h++){
      hot[h].addEventListener('mouseenter', function(){ document.body.classList.add('hot'); });
      hot[h].addEventListener('mouseleave', function(){ document.body.classList.remove('hot'); });
    }
  }

  /* ---- particle network ---- */
  var cv = document.getElementById('net'), ctx = cv.getContext('2d');
  var COLORS = ['#7a5cff','#ff2d8a','#22e3ff','#ffb020'];
  var pts = [], W = 0, H = 0;

  function resize(){
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    var count = Math.min(90, Math.round(W*H/16000));
    pts = [];
    for (var i=0;i<count;i++){
      pts.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.42, vy: (Math.random()-0.5)*0.42,
        r: Math.random()*1.9 + 0.9,
        c: COLORS[Math.floor(Math.random()*COLORS.length)]
      });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  function hexToRgb(h){
    return [parseInt(h.substr(1,2),16), parseInt(h.substr(3,2),16), parseInt(h.substr(5,2),16)];
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    for (var i=0;i<pts.length;i++){
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.75;
      ctx.fill();

      for (var j=i+1;j<pts.length;j++){
        var q = pts[j], dx = p.x-q.x, dy = p.y-q.y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 130){
          var rgb = hexToRgb(p.c);
          ctx.beginPath();
          ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + (0.30*(1-d/130)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      // gentle attraction to the pointer
      var mdx = p.x-mx, mdy = p.y-my, md = Math.sqrt(mdx*mdx+mdy*mdy);
      if (md < 150){
        ctx.beginPath();
        ctx.moveTo(p.x,p.y); ctx.lineTo(mx,my);
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.14*(1-md/150)) + ')';
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  if (!reduce) draw(); else { /* draw one static frame */ ctx.clearRect(0,0,W,H); }

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(function(el, i){
    el.style.transitionDelay = (Math.min(i,6)*45) + 'ms';
    io.observe(el);
  });

  /* ---- skill bars ---- */
  var bio = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      var f = en.target;
      setTimeout(function(){
        f.style.width = f.getAttribute('data-w') + '%';
        setTimeout(function(){ f.classList.add('swept'); }, 1500);
      }, 180);
      bio.unobserve(f);
    });
  }, {threshold:0.4});
  document.querySelectorAll('.fill').forEach(function(f){ bio.observe(f); });

  /* ---- smooth scroll with navbar offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 68, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
