/* ============================================================
   main.js — 首页逻辑
   职责：数据渲染卡片、分类筛选、关键词搜索、导航菜单、滚动动效
   ============================================================ */
(function () {
  'use strict';

  const cardGrid = document.getElementById('cardGrid');
  const resultNote = document.getElementById('resultNote');
  const filterBar = document.getElementById('filterBar');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  let currentCat = 'all';
  let currentKeyword = '';

  /* ---------- 渲染单张卡片 ---------- */
  function cardHTML(item) {
    const badgeClass = 'card__badge--' + item.category;
    const tags = (item.tags || []).slice(0, 2).map(function (t) {
      return '<span class="card__tag">' + esc(t) + '</span>';
    }).join('');
    return '<article class="card fade-up">' +
      '<a class="card__media" href="detail.html?id=' + encodeURIComponent(item.id) + '">' +
        '<img loading="lazy" src="' + item.cover + '" alt="' + esc(item.name) + '">' +
        '<span class="card__badge ' + badgeClass + '">' + esc(item.typeLabel) + '</span>' +
      '</a>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(item.name) + '</h3>' +
        '<p class="card__summary">' + esc(item.summary) + '</p>' +
        '<div class="card__meta">' +
          '<div class="card__tags">' + tags + '</div>' +
          '<a class="card__link" href="detail.html?id=' + encodeURIComponent(item.id) + '">查看详情 →</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* ---------- 组合过滤：分类 + 关键词 ---------- */
  function filterData() {
    const kw = currentKeyword.trim().toLowerCase();
    return window.QZ.data.filter(function (item) {
      const catOk = currentCat === 'all' || item.category === currentCat;
      if (!catOk) return false;
      if (!kw) return true;
      const hay = (item.name + ' ' + item.summary + ' ' + (item.tags || []).join(' ') + ' ' + item.typeLabel).toLowerCase();
      return hay.indexOf(kw) > -1;
    });
  }

  /* ---------- 渲染卡片网格 ---------- */
  function render() {
    const list = filterData();
    if (!list.length) {
      cardGrid.innerHTML = '<div class="empty-state">😊 没有找到匹配的内容，换个关键词或分类试试～</div>';
      resultNote.innerHTML = '';
    } else {
      cardGrid.innerHTML = list.map(cardHTML).join('');
      observeFade();
    }
    if (currentKeyword.trim()) {
      resultNote.innerHTML = '在「' + catName(currentCat) + '」下找到 <strong>' + list.length + '</strong> 条与 “<strong>' +
        esc(currentKeyword.trim()) + '</strong>” 相关的内容';
    } else {
      resultNote.innerHTML = currentCat === 'all'
        ? '为你精选了 <strong>' + list.length + '</strong> 处泉州景点、美食与文化'
        : '「' + catName(currentCat) + '」共 <strong>' + list.length + '</strong> 条';
    }
  }

  function catName(cat) {
    return { all: '全部', spot: '景点', food: '美食', culture: '文化' }[cat] || cat;
  }

  /* ---------- 分类 Tab ---------- */
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      currentCat = tab.getAttribute('data-cat');
      filterBar.querySelectorAll('.filter-tab').forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
      });
      render();
    });
  }

  /* ---------- 导航/页脚「分类跳转」：设置筛选并滚动到内容区 ---------- */
  document.querySelectorAll('[data-goto]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const cat = link.getAttribute('data-goto');
      const tab = filterBar && filterBar.querySelector('.filter-tab[data-cat="' + cat + '"]');
      if (tab) { tab.click(); }
      // 保持默认锚点滚动行为
    });
  });

  /* ---------- 搜索 ---------- */
  function doSearch() { currentKeyword = searchInput.value; render(); }
  if (searchInput) {
    searchInput.addEventListener('input', debounce(doSearch, 200));
    searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });
  }
  if (searchBtn) searchBtn.addEventListener('click', doSearch);

  /* ---------- 移动端导航 ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('is-open'); });
  }

  /* ---------- 滚动淡入 ---------- */
  let observer;
  function observeFade() {
    if (observer) observer.disconnect();
    const els = document.querySelectorAll('.fade-up:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); observer.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 初始化 ---------- */
  window.QZ.load().then(function () {
    // hero / carousel 已在其模块中渲染，这里渲染卡片
    render();
  });

  /* ---------- 工具函数 ---------- */
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function debounce(fn, wait) {
    let t; return function () { clearTimeout(t); t = setTimeout(fn, wait); };
  }
})();
