/* ============================================================
   carousel.js — 轮播图（自实现，无第三方依赖，双击即可运行）
   支持：自动播放、左右切换、分页指示点、循环
   ============================================================ */
(function () {
  'use strict';

  const track = document.getElementById('carouselTrack');
  if (!track) return;
  const slidesEl = track.querySelector('.carousel__slides');
  const dotsEl = document.getElementById('carouselDots');

  let index = 0, timer = null, count = 0;

  function build(items) {
    count = items.length || 0;
    slidesEl.innerHTML = items.map(function (it) {
      return '<div class="carousel__slide">' +
        '<img src="assets/images/' + (it.img || it.id + '.jpg') + '" alt="' + esc(it.name) + '">' +
        '<div class="carousel__caption"><h3>' + esc(it.name) + '</h3><p>' + esc(it.caption) + '</p></div>' +
      '</div>';
    }).join('');

    dotsEl.innerHTML = items.map(function (_, i) {
      return '<button class="carousel__dot' + (i === 0 ? ' is-active' : '') + '" data-idx="' + i + '" aria-label="第' + (i + 1) + '张"></button>';
    }).join('');

    dotsEl.addEventListener('click', function (e) {
      const d = e.target.closest('.carousel__dot');
      if (d) { go(parseInt(d.getAttribute('data-idx'), 10)); restart(); }
    });
  }

  function go(i) {
    if (!count) return;
    index = (i + count) % count;
    slidesEl.style.transform = 'translateX(-' + (index * 100) + '%)';
    dotsEl.querySelectorAll('.carousel__dot').forEach(function (d, j) {
      d.classList.toggle('is-active', j === index);
    });
  }

  function next() { go(index + 1); }
  function prev() { go(index - 1); }
  function start() { stop(); timer = setInterval(next, 4000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  if (btnPrev) btnPrev.addEventListener('click', function () { prev(); restart(); });
  if (btnNext) btnNext.addEventListener('click', function () { next(); restart(); });

  // 悬停暂停
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);

  window.QZ.load().then(function () {
    build(window.QZ.carousel);
    start();
  });

  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
})();
