/* ============================================================
   detail.js — 详情页动态渲染
   读取 URL 的 ?id= 参数 → 从数据中查找并渲染；未找到给出友好提示。
   ============================================================ */
(function () {
  'use strict';

  const heroImg = document.getElementById('detailHeroImg');
  const titleEl = document.getElementById('detailTitle');
  const badgeEl = document.getElementById('detailBadge');
  const locEl = document.getElementById('detailLoc');
  const recEl = document.getElementById('detailRecommend');
  const contentEl = document.getElementById('detailContent');
  const tagsEl = document.getElementById('detailTags');
  const recGrid = document.getElementById('recommendGrid');
  const notFound = document.getElementById('notFound');
  const detailMain = document.getElementById('detailMain');

  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function badgeClass(cat) {
    return { spot: 'badge badge--spot', food: 'badge badge--food', culture: 'badge badge--culture' }[cat] || 'badge';
  }

  /* 依据分类渲染三张相关推荐卡片 */
  function renderRecommend(item) {
    const related = window.QZ.data.filter(function (it) {
      return it.category === item.category && it.id !== item.id;
    }).slice(0, 3);
    if (!related.length) { recGrid.innerHTML = ''; return; }
    recGrid.innerHTML = related.map(function (it) {
      return '<article class="card fade-up">' +
        '<a class="card__media" href="detail.html?id=' + encodeURIComponent(it.id) + '">' +
          '<img loading="lazy" src="' + it.cover + '" alt="' + esc(it.name) + '">' +
          '<span class="card__badge card__badge--' + it.category + '">' + esc(it.typeLabel) + '</span>' +
        '</a>' +
        '<div class="card__body"><h3 class="card__title">' + esc(it.name) + '</h3>' +
          '<p class="card__summary">' + esc(it.summary) + '</p>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function render(item) {
    detailMain.style.display = 'block';
    heroImg.src = item.cover;
    heroImg.alt = item.name;
    titleEl.textContent = item.name;
    badgeEl.textContent = item.typeLabel;
    badgeEl.className = badgeClass(item.category);
    locEl.textContent = item.location ? '📍 ' + item.location : '';
    recEl.textContent = item.recommendation ? '🌟 ' + item.recommendation : '';

    /* 正文：简介 + 特色/亮点 + 小贴士 */
    let html = '<p>' + esc(item.intro) + '</p>';
    if (item.tags && item.tags.length) {
      html += '<h2 class="detail-sub">特色亮点</h2><ul style="list-style:disc;padding-left:20px;margin:0 0 1em">' +
        item.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    }
    if (item.tips) {
      html += '<h2 class="detail-sub">游玩小贴士</h2><p>' + esc(item.tips) + '</p>';
    }
    contentEl.innerHTML = html;

    tagsEl.innerHTML = item.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    renderRecommend(item);
  }

  function showNotFound() {
    detailMain.style.display = 'none';
    notFound.style.display = 'block';
  }

  window.QZ.load().then(function () {
    const id = new URLSearchParams(window.location.search).get('id');
    const item = id ? window.QZ.find(id) : null;
    if (item) render(item); else showNotFound();
  });
})();
