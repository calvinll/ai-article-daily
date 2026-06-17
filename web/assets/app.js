function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.json();
}

function badge(label) {
  return `<span class="badge">${label}</span>`;
}

function renderActiveFilters(el, chips) {
  if (!el) return;
  if (chips.length === 0) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = chips.map((chip) => badge(chip.label)).join('');
}

function renderToday(article) {
  const el = document.getElementById('today-article');
  if (!el) return;
  if (!article) {
    el.innerHTML = '<p>今天还没有推荐内容。</p>';
    return;
  }
  el.innerHTML = `
    <div class="card-header">
      <div>
        <p class="eyebrow">Today’s pick</p>
        <h2>${article.title}</h2>
      </div>
      <div class="badge-group">
        ${article.themes.map((theme) => badge(theme)).join('')}
        ${article.isOfficial ? badge('官方来源') : ''}
        ${article.isNoteworthy ? badge('值得关注') : ''}
      </div>
    </div>
    <p class="meta">来源：${article.sourceName}</p>
    <p class="lead">${article.summary}</p>
    <p><strong>为什么推荐：</strong>${article.whyRecommended}</p>
    <div class="link-stack">
      <p class="link-row"><a href="./article.html?id=${encodeURIComponent(article.id)}">查看详情 →</a></p>
      <p class="link-row"><a href="${article.canonicalUrl}" target="_blank" rel="noreferrer">查看原文 →</a></p>
    </div>
  `;
}

function renderSpotlight(items, todayId) {
  const el = document.getElementById('spotlight-list');
  const empty = document.getElementById('spotlight-empty');
  if (!el) return;

  const spotlight = items
    .filter((item) => item.id !== todayId)
    .filter((item) => item.isOfficial || item.isNoteworthy || item.isRecent)
    .slice(0, 4);

  el.innerHTML = spotlight.map((item) => `
    <article class="mini-card">
      <h3>${item.title}</h3>
      <p class="meta">${item.sourceName}</p>
      <p class="lead">${item.summary}</p>
      <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.id)}">查看详情 →</a></p>
    </article>
  `).join('');

  if (empty) empty.hidden = spotlight.length > 0;
}

function renderSpotlight(items, todayId) {
  const el = document.getElementById('spotlight-list');
  const empty = document.getElementById('spotlight-empty');
  if (!el) return;

  const spotlight = items
    .filter((item) => item.id !== todayId)
    .filter((item) => item.isOfficial || item.isNoteworthy || item.isRecent)
    .slice(0, 4);

  el.innerHTML = spotlight.map((item) => `
    <article class="mini-card">
      <h3>${item.title}</h3>
      <p class="meta">${item.sourceName}</p>
      <p class="lead">${item.summary}</p>
      <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.id)}">查看详情 →</a></p>
    </article>
  `).join('');

  if (empty) empty.hidden = spotlight.length > 0;
}

function renderSpotlight(items, todayId) {
  const el = document.getElementById('spotlight-list');
  const empty = document.getElementById('spotlight-empty');
  if (!el) return;

  const spotlight = items
    .filter((item) => item.id !== todayId)
    .filter((item) => item.isOfficial || item.isNoteworthy || item.isRecent)
    .slice(0, 4);

  el.innerHTML = spotlight.map((item) => `
    <article class="mini-card">
      <h3>${item.title}</h3>
      <p class="meta">${item.sourceName}</p>
      <p class="lead">${item.summary}</p>
      <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.id)}">查看详情 →</a></p>
    </article>
  `).join('');

  if (empty) empty.hidden = spotlight.length > 0;
}

function renderArticleList(items) {
  const el = document.getElementById('article-list');
  const count = document.getElementById('article-result-count');
  const empty = document.getElementById('article-empty');
  if (!el) return;
  el.innerHTML = items.map((item) => `
    <article class="card">
      <div class="card-header">
        <h2>${item.title}</h2>
        <div class="badge-group">
          ${item.themes.map((theme) => badge(theme)).join('')}
          ${item.isOfficial ? badge('官方来源') : ''}
          ${item.isNoteworthy ? badge('值得关注') : ''}
        </div>
      </div>
      <p class="lead">${item.summary}</p>
      <p class="meta">来源：${item.sourceName}</p>
      <div class="link-stack">
        <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.id)}">查看详情 →</a></p>
        <p class="link-row"><a href="${item.canonicalUrl}" target="_blank" rel="noreferrer">查看原文 →</a></p>
      </div>
    </article>
  `).join('');
  if (count) count.textContent = `筛选后 ${items.length} 篇文章`;
  if (empty) empty.hidden = items.length > 0;
}

function groupHistoryByDate(items) {
  const groups = new Map();
  for (const item of items) {
    const group = groups.get(item.date) ?? [];
    group.push(item);
    groups.set(item.date, group);
  }
  return Array.from(groups.entries());
}

function renderHistory(items) {
  const el = document.getElementById('history-list');
  const count = document.getElementById('history-result-count');
  const empty = document.getElementById('history-empty');
  if (!el) return;

  const groups = groupHistoryByDate(items);
  el.innerHTML = groups.map(([date, entries]) => `
    <section class="archive-group">
      <div class="section-heading archive-heading">
        <div>
          <span class="eyebrow">Archive</span>
          <h2>${date}</h2>
        </div>
        <p class="meta">共 ${entries.length} 条记录</p>
      </div>
      <div class="archive-group-list">
        ${entries.map((item) => `
          <article class="card">
            <h3>${item.title}</h3>
            <p class="meta">${item.sourceName} · ${item.status}</p>
            <div class="badge-group">${item.themes.map((theme) => badge(theme)).join('')}</div>
            <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.articleId)}">查看详情 →</a></p>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  if (count) count.textContent = `筛选后 ${items.length} 条历史记录`;
  if (empty) empty.hidden = items.length > 0;
}

function renderDetail(detail) {
  const el = document.getElementById('article-detail');
  if (!el) return;
  if (!detail) {
    el.innerHTML = '<h2>没有找到这篇文章</h2><p>请从首页返回重新选择。</p>';
    return;
  }
  el.innerHTML = `
    <div class="card-header">
      <div>
        <p class="eyebrow">Article detail</p>
        <h2>${detail.title}</h2>
      </div>
      <div class="badge-group">
        ${detail.themes.map((theme) => badge(theme)).join('')}
        ${detail.isOfficial ? badge('官方来源') : ''}
        ${detail.isRecent ? badge('近期') : ''}
        ${detail.isNoteworthy ? badge('值得关注') : ''}
      </div>
    </div>
    <p class="meta">来源：${detail.sourceName} · 类型：${detail.sourceType}</p>
    <p class="lead">${detail.summary}</p>
    <section class="section-block">
      <h3>为什么推荐</h3>
      <p>${detail.whyRecommended}</p>
    </section>
    <section class="section-block split-grid">
      <div>
        <h3>主题</h3>
        <div class="badge-group">${detail.themes.map((theme) => badge(theme)).join('')}</div>
      </div>
      <div>
        <h3>标签</h3>
        <p class="meta">${detail.tags.join(' / ') || '暂无'}</p>
      </div>
    </section>
    <section class="section-block">
      <h3>更多信息</h3>
      <p class="meta">发布时间：${detail.publishedAt ?? '未知'}</p>
      <p class="link-row"><a href="${detail.canonicalUrl}" target="_blank" rel="noreferrer">查看原文 →</a></p>
    </section>
  `;
}

function populateSelect(select, items, extractor, placeholder = '全部') {
  if (!select) return;
  const values = new Set();
  items.forEach((item) => {
    const raw = extractor(item);
    if (Array.isArray(raw)) raw.forEach((value) => value && values.add(value));
    else if (raw) values.add(raw);
  });
  const current = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>${Array.from(values).sort().map((value) => `<option value="${value}">${value}</option>`).join('')}`;
  select.value = current;
}

function bindArticleFilters(items) {
  const search = document.getElementById('article-search');
  const theme = document.getElementById('article-theme-filter');
  const source = document.getElementById('article-source-filter');
  const active = document.getElementById('article-active-filters');

  populateSelect(theme, items, (item) => item.themes, '全部主题');
  populateSelect(source, items, (item) => item.sourceName, '全部来源');

  const rerender = () => {
    const keyword = search?.value?.trim().toLowerCase() ?? '';
    const themeValue = theme?.value ?? '';
    const sourceValue = source?.value ?? '';

    const filtered = items.filter((item) => {
      const matchesKeyword = !keyword || [item.title, item.summary].join(' ').toLowerCase().includes(keyword);
      const matchesTheme = !themeValue || item.themes.includes(themeValue);
      const matchesSource = !sourceValue || item.sourceName === sourceValue;
      return matchesKeyword && matchesTheme && matchesSource;
    });

    const chips = [];
    if (keyword) chips.push({ label: `搜索：${keyword}` });
    if (themeValue) chips.push({ label: `主题：${themeValue}` });
    if (sourceValue) chips.push({ label: `来源：${sourceValue}` });
    renderActiveFilters(active, chips);
    renderArticleList(filtered);
  };

  search?.addEventListener('input', rerender);
  theme?.addEventListener('change', rerender);
  source?.addEventListener('change', rerender);
  rerender();
}

function bindHistoryFilters(items) {
  const search = document.getElementById('history-search');
  const theme = document.getElementById('history-theme-filter');
  const status = document.getElementById('history-status-filter');
  const active = document.getElementById('history-active-filters');

  populateSelect(theme, items, (item) => item.themes, '全部主题');

  const rerender = () => {
    const keyword = search?.value?.trim().toLowerCase() ?? '';
    const themeValue = theme?.value ?? '';
    const statusValue = status?.value ?? '';

    const filtered = items.filter((item) => {
      const matchesKeyword = !keyword || item.title.toLowerCase().includes(keyword);
      const matchesTheme = !themeValue || item.themes.includes(themeValue);
      const matchesStatus = !statusValue || item.status === statusValue;
      return matchesKeyword && matchesTheme && matchesStatus;
    });

    const chips = [];
    if (keyword) chips.push({ label: `搜索：${keyword}` });
    if (themeValue) chips.push({ label: `主题：${themeValue}` });
    if (statusValue) chips.push({ label: `状态：${statusValue}` });
    renderActiveFilters(active, chips);
    renderHistory(filtered);
  };

  search?.addEventListener('input', rerender);
  theme?.addEventListener('change', rerender);
  status?.addEventListener('change', rerender);
  rerender();
}

const path = window.location.pathname;
if (path.endsWith('/article.html')) {
  const id = getQueryParam('id');
  fetchJson('./data/article-details.json')
    .then((items) => items.find((item) => item.id === id)?.detail ?? null)
    .then(renderDetail)
    .catch(console.error);
} else if (path.endsWith('/archive.html')) {
  fetchJson('./data/history.json').then(bindHistoryFilters).catch(console.error);
} else {
  Promise.all([
    fetchJson('./data/today.json'),
    fetchJson('./data/articles.json'),
  ]).then(([today, articles]) => {
    renderToday(today);
    renderSpotlight(articles, today?.id);
    bindArticleFilters(articles);
  }).catch(console.error);
}
