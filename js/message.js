/* ============================================================
   message.js — 留言板
   - 后端优先：若 /api/messages 可用（Flask + MySQL 后端），
     则增删查走后端；否则自动回退到 localStorage（纯前端保底）。
   ============================================================ */
(function () {
  'use strict';

  const form = document.getElementById('msgForm');
  const listEl = document.getElementById('msgList');
  const nameEl = document.getElementById('msgName');
  const contentEl = document.getElementById('msgContent');
  const STORE_KEY = 'qz_msg_list';
  let usingApi = false;

  /* 后端地址（在本地服务器 / 部署环境生效） */
  const API = window.location.protocol === 'file:' ? null : '/api';

  /* ---------- 读取留言 ---------- */
  async function fetchMessages() {
    if (API) {
      try {
        const res = await fetch(API + '/messages');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) { usingApi = true; return list; }
        }
      } catch (e) { /* 后端不可用，回退 */ }
    }
    usingApi = false;
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  /* ---------- 新增留言 ---------- */
  async function addMessage(name, content) {
    const msg = { name: name, content: content, time: new Date().toLocaleString('zh-CN') };
    if (usingApi) {
      try {
        const res = await fetch(API + '/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg)
        });
        if (res.ok) return await res.json();
      } catch (e) { usingApi = false; }
    }
    const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    list.unshift(msg);
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
    return msg;
  }

  /* ---------- 渲染（用 textContent 防 XSS） ---------- */
  function render(list) {
    if (!list.length) {
      listEl.innerHTML = '<div class="msg-empty">还没有留言，快来写下你的第一条推荐吧～</div>';
      return;
    }
    listEl.innerHTML = '';
    list.forEach(function (m) {
      const item = document.createElement('div');
      item.className = 'msg-item';
      const head = document.createElement('div');
      head.className = 'msg-item__head';
      const name = document.createElement('span');
      name.className = 'msg-item__name';
      name.textContent = m.name || '游客';
      const time = document.createElement('span');
      time.className = 'msg-item__time';
      time.textContent = m.time || '';
      head.appendChild(name); head.appendChild(time);
      const cont = document.createElement('p');
      cont.className = 'msg-item__content';
      cont.textContent = m.content;
      item.appendChild(head); item.appendChild(cont);
      listEl.appendChild(item);
    });
  }

  /* ---------- 提交 ---------- */
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = (nameEl.value || '').trim();
      const content = (contentEl.value || '').trim();
      if (!name || !content) { alert('请填写昵称和留言内容'); return; }
      const msg = await addMessage(name, content);
      const list = await fetchMessages();
      render(list);
      form.reset();
    });
  }

  /* ---------- 初始化 ---------- */
  fetchMessages().then(render);
})();
