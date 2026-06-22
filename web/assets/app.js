function formatDate(value) {
  if (!value) return '未知';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '未知';
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function updateQueryParams(updates) {
  const params = getSearchParams();
  Object.entries(updates).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });
  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState({}, '', url);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.json();
}

function badge(label) {
  return `<span class="badge">${label}</span>`;
}

function actionChip(label, key) {
  return `
    <button type="button" class="filter-chip" data-filter-key="${key}">
      <span>${label}</span>
      <span aria-hidden="true">×</span>
    </button>
  `;
}

function formatSourceType(sourceType) {
  if (sourceType === 'rss') return 'RSS';
  if (sourceType === 'changelog') return 'Changelog';
  if (sourceType === 'manual') return 'Manual';
  return sourceType;
}

function formatHistoryStatus(status) {
  if (status === 'success') return '已收录';
  if (status === 'failed') return '处理失败';
  if (status === 'skipped') return '已跳过';
  return status;
}

function renderErrorState(containerId, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="state-block error-state"><p>${message}</p></div>`;
}

function renderLoadingState(containerId, message, lines = 3) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="state-block loading-state" aria-live="polite">
      <p>${message}</p>
      <div class="skeleton-stack">
        ${Array.from({ length: lines }, () => '<span class="skeleton-line"></span>').join('')}
      </div>
    </div>
  `;
}

function setResetButton(resetButton, visible, onReset) {
  if (!resetButton) return;
  resetButton.hidden = !visible;
  resetButton.onclick = visible ? onReset : null;
}

function renderActiveFilters(el, chips, resetButton, onRemove, onReset) {
  if (!el) return;
  if (chips.length === 0) {
    el.innerHTML = '';
    setResetButton(resetButton, false, onReset);
    return;
  }

  el.innerHTML = chips.map((chip) => actionChip(chip.label, chip.key)).join('');
  el.querySelectorAll('[data-filter-key]').forEach((button) => {
    button.addEventListener('click', () => onRemove(button.getAttribute('data-filter-key')));
  });
  setResetButton(resetButton, true, onReset);
}

function renderToday(article) {
  const el = document.getElementById('today-article');
  if (!el) return;
  if (!article) {
    el.innerHTML = '<div class="state-block empty-state"><p>今天还没有推荐内容。</p></div>';
    return;
  }
  el.innerHTML = `
    <div class="card-header featured-header">
      <div>
        <p class="eyebrow">Today’s pick</p>
        <h2>${article.title}</h2>
        <p class="meta-row">
          <span>${article.sourceName}</span>
          <span>${formatSourceType(article.sourceType)}</span>
          <span>${formatDate(article.publishedAt)}</span>
        </p>
      </div>
      <div class="badge-group">
        ${article.themes.map((theme) => badge(theme)).join('')}
        ${article.isOfficial ? badge('官方来源') : ''}
        ${article.isRecent ? badge('近期') : ''}
        ${article.isNoteworthy ? badge('值得关注') : ''}
      </div>
    </div>
    <p class="lead">${article.summary}</p>
    <p><strong>为什么推荐：</strong>${article.whyRecommended}</p>
    <div class="link-stack">
      <p class="link-row"><a href="./article.html?id=${encodeURIComponent(article.id)}">查看详情 →</a></p>
      <p class="link-row"><a href="${article.canonicalUrl}" target="_blank" rel="noreferrer">查看原文 →</a></p>
    </div>
  `;
}

function getSpotlightItems(items, todayId) {
  return items
    .filter((item) => item.id !== todayId)
    .filter((item) => item.isOfficial || item.isNoteworthy || item.isRecent)
    .slice(0, 4);
}

function renderSpotlight(items, todayId) {
  const el = document.getElementById('spotlight-list');
  const empty = document.getElementById('spotlight-empty');
  if (!el) return;

  const spotlight = getSpotlightItems(items, todayId);

  el.innerHTML = spotlight.map((item) => `
    <article class="mini-card">
      <div class="mini-card-meta">
        <span>${item.sourceName}</span>
        <span>${formatSourceType(item.sourceType)}</span>
        <span>${formatDate(item.publishedAt)}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="lead">${item.summary}</p>
      <div class="badge-group compact-badges">
        ${item.isRecent ? badge('近期') : ''}
        ${item.isOfficial ? badge('官方来源') : ''}
      </div>
      <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.id)}">查看详情 →</a></p>
    </article>
  `).join('');

  if (empty) empty.hidden = spotlight.length > 0;
}

function renderArticleList(items, totalCount) {
  const el = document.getElementById('article-list');
  const count = document.getElementById('article-result-count');
  const empty = document.getElementById('article-empty');
  if (!el) return;
  el.innerHTML = items.map((item) => `
    <article class="card">
      <div class="card-header">
        <div>
          <h2>${item.title}</h2>
          <p class="meta-row">
            <span>${item.sourceName}</span>
            <span>${formatSourceType(item.sourceType)}</span>
            <span>${formatDate(item.publishedAt)}</span>
          </p>
        </div>
        <div class="badge-group">
          ${item.themes.map((theme) => badge(theme)).join('')}
          ${item.isOfficial ? badge('官方来源') : ''}
          ${item.isRecent ? badge('近期') : ''}
          ${item.isNoteworthy ? badge('值得关注') : ''}
        </div>
      </div>
      <p class="lead">${item.summary}</p>
      <div class="link-stack">
        <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.id)}">查看详情 →</a></p>
        <p class="link-row"><a href="${item.canonicalUrl}" target="_blank" rel="noreferrer">查看原文 →</a></p>
      </div>
    </article>
  `).join('');
  if (count) count.textContent = `显示 ${items.length} / 总计 ${totalCount} 篇文章`;
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

function renderHistory(items, totalCount) {
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
            <div class="card-header">
              <div>
                <h3>${item.title}</h3>
                <p class="meta-row">
                  <span>${item.sourceName}</span>
                  <span>${formatSourceType(item.sourceType)}</span>
                  <span>${formatHistoryStatus(item.status)}</span>
                </p>
              </div>
              <div class="badge-group compact-badges">${item.themes.map((theme) => badge(theme)).join('')}</div>
            </div>
            <p class="link-row"><a href="./article.html?id=${encodeURIComponent(item.articleId)}">查看详情 →</a></p>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  if (count) count.textContent = `显示 ${items.length} / 总计 ${totalCount} 条历史记录`;
  if (empty) empty.hidden = items.length > 0;
}

function renderDetailState(title, message) {
  const el = document.getElementById('article-detail');
  if (!el) return;
  el.innerHTML = `
    <div class="state-block empty-state">
      <h2>${title}</h2>
      <p>${message}</p>
      <p class="link-row"><a href="./index.html">返回首页 →</a></p>
    </div>
  `;
}

function renderDetail(detail) {
  const el = document.getElementById('article-detail');
  if (!el) return;
  if (!detail) {
    renderDetailState('没有找到这篇文章', '请从首页或历史归档返回重新选择。');
    return;
  }
  el.innerHTML = `
    <div class="card-header featured-header">
      <div>
        <p class="eyebrow">Article detail</p>
        <h2>${detail.title}</h2>
        <p class="meta-row">
          <span>${detail.sourceName}</span>
          <span>${formatSourceType(detail.sourceType)}</span>
          <span>${formatDate(detail.publishedAt)}</span>
        </p>
      </div>
      <div class="badge-group">
        ${detail.themes.map((theme) => badge(theme)).join('')}
        ${detail.isOfficial ? badge('官方来源') : ''}
        ${detail.isRecent ? badge('近期') : ''}
        ${detail.isNoteworthy ? badge('值得关注') : ''}
      </div>
    </div>
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
      <p class="meta">发布时间：${formatDate(detail.publishedAt)}</p>
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
  const reset = document.getElementById('article-reset-filters');

  const state = {
    keyword: getSearchParams().get('q') ?? '',
    theme: getSearchParams().get('theme') ?? '',
    source: getSearchParams().get('source') ?? '',
  };

  populateSelect(theme, items, (item) => item.themes, '全部主题');
  populateSelect(source, items, (item) => item.sourceName, '全部来源');

  if (search) search.value = state.keyword;
  if (theme) theme.value = state.theme;
  if (source) source.value = state.source;

  const rerender = () => {
    const filtered = items.filter((item) => {
      const matchesKeyword = !state.keyword || [item.title, item.summary].join(' ').toLowerCase().includes(state.keyword.toLowerCase());
      const matchesTheme = !state.theme || item.themes.includes(state.theme);
      const matchesSource = !state.source || item.sourceName === state.source;
      return matchesKeyword && matchesTheme && matchesSource;
    });

    updateQueryParams({ q: state.keyword, theme: state.theme, source: state.source });

    const chips = [];
    if (state.keyword) chips.push({ key: 'keyword', label: `搜索：${state.keyword}` });
    if (state.theme) chips.push({ key: 'theme', label: `主题：${state.theme}` });
    if (state.source) chips.push({ key: 'source', label: `来源：${state.source}` });

    renderActiveFilters(active, chips, reset, (key) => {
      state[key] = '';
      if (key === 'keyword' && search) search.value = '';
      if (key === 'theme' && theme) theme.value = '';
      if (key === 'source' && source) source.value = '';
      rerender();
    }, () => {
      state.keyword = '';
      state.theme = '';
      state.source = '';
      if (search) search.value = '';
      if (theme) theme.value = '';
      if (source) source.value = '';
      rerender();
    });

    renderArticleList(filtered, items.length);
  };

  search?.addEventListener('input', () => {
    state.keyword = search.value.trim();
    rerender();
  });
  theme?.addEventListener('change', () => {
    state.theme = theme.value;
    rerender();
  });
  source?.addEventListener('change', () => {
    state.source = source.value;
    rerender();
  });
  rerender();
}

function bindHistoryFilters(items) {
  const search = document.getElementById('history-search');
  const theme = document.getElementById('history-theme-filter');
  const status = document.getElementById('history-status-filter');
  const active = document.getElementById('history-active-filters');
  const reset = document.getElementById('history-reset-filters');

  const state = {
    keyword: getSearchParams().get('q') ?? '',
    theme: getSearchParams().get('theme') ?? '',
    status: getSearchParams().get('status') ?? '',
  };

  populateSelect(theme, items, (item) => item.themes, '全部主题');

  if (search) search.value = state.keyword;
  if (theme) theme.value = state.theme;
  if (status) status.value = state.status;

  const rerender = () => {
    const filtered = items.filter((item) => {
      const matchesKeyword = !state.keyword || item.title.toLowerCase().includes(state.keyword.toLowerCase());
      const matchesTheme = !state.theme || item.themes.includes(state.theme);
      const matchesStatus = !state.status || item.status === state.status;
      return matchesKeyword && matchesTheme && matchesStatus;
    });

    updateQueryParams({ q: state.keyword, theme: state.theme, status: state.status });

    const chips = [];
    if (state.keyword) chips.push({ key: 'keyword', label: `搜索：${state.keyword}` });
    if (state.theme) chips.push({ key: 'theme', label: `主题：${state.theme}` });
    if (state.status) chips.push({ key: 'status', label: `状态：${formatHistoryStatus(state.status)}` });

    renderActiveFilters(active, chips, reset, (key) => {
      state[key] = '';
      if (key === 'keyword' && search) search.value = '';
      if (key === 'theme' && theme) theme.value = '';
      if (key === 'status' && status) status.value = '';
      rerender();
    }, () => {
      state.keyword = '';
      state.theme = '';
      state.status = '';
      if (search) search.value = '';
      if (theme) theme.value = '';
      if (status) status.value = '';
      rerender();
    });

    renderHistory(filtered, items.length);
  };

  search?.addEventListener('input', () => {
    state.keyword = search.value.trim();
    rerender();
  });
  theme?.addEventListener('change', () => {
    state.theme = theme.value;
    rerender();
  });
  status?.addEventListener('change', () => {
    state.status = status.value;
    rerender();
  });
  rerender();
}

async function initArticlePage() {
  const id = getQueryParam('id');
  if (!id) {
    renderDetailState('缺少文章标识', '请从首页或历史归档重新进入文章详情。');
    return;
  }
  const items = await fetchJson('./data/article-details.json');
  renderDetail(items.find((item) => item.id === id)?.detail ?? null);
}

async function initArchivePage() {
  renderLoadingState('history-list', '正在加载历史归档…', 4);
  const history = await fetchJson('./data/history.json');
  bindHistoryFilters(history);
}

async function initHomePage() {
  renderLoadingState('today-article', '正在加载今日推荐…', 2);
  renderLoadingState('spotlight-list', '正在加载近期重点…', 3);
  renderLoadingState('article-list', '正在加载文章列表…', 4);

  const [today, articles] = await Promise.all([
    fetchJson('./data/today.json'),
    fetchJson('./data/articles.json'),
  ]);
  renderToday(today);
  renderSpotlight(articles, today?.id);
  bindArticleFilters(articles);
}

async function initPage() {
  const pathname = window.location.pathname;

  try {
    if (pathname.endsWith('/article.html')) {
      renderLoadingState('article-detail', '正在加载文章详情…', 3);
      await initArticlePage();
      return;
    }

    if (pathname.endsWith('/archive.html')) {
      await initArchivePage();
      return;
    }

    await initHomePage();
  } catch (error) {
    console.error(error);
    if (pathname.endsWith('/article.html')) {
      renderErrorState('article-detail', '文章详情加载失败，请稍后重试。');
      return;
    }
    if (pathname.endsWith('/archive.html')) {
      renderErrorState('history-list', '历史归档加载失败，请稍后重试。');
      return;
    }
    renderErrorState('today-article', '今日推荐加载失败，请稍后重试。');
    renderErrorState('spotlight-list', '近期重点加载失败，请稍后重试。');
    renderErrorState('article-list', '文章列表加载失败，请稍后重试。');
  }
}

void initPage();
