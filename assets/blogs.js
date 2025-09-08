(function () {
  const GRID = document.getElementById('blog-grid');
  const TABS = document.querySelectorAll('.blog-tabs .tab-btn');
  const HASH_TO_FILTER = { '#wbg': 'wbg', '#articles': 'articles', '#mentions': 'mentions', '#all': 'all' };

  let DATA = [];

  // Render helpers
  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return iso; }
  };

  const card = (item) => `
    <article class="article-card" data-category="${item.category}">
      <a class="article-media" href="${item.url}" target="_blank" rel="noopener">
        <img src="${item.thumbnail}" alt="" loading="lazy" />
      </a>
      <div class="article-body">
        <h3 class="article-title"><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
        <p class="article-meta">${item.source} • ${fmtDate(item.date)}</p>
        <p class="article-excerpt">${item.excerpt || ''}</p>
        <a class="article-link" href="${item.url}" target="_blank" rel="noopener">Read →</a>
      </div>
    </article>
  `;

  const render = (filter = 'all') => {
    const items = (filter === 'all') ? DATA : DATA.filter(x => x.category === filter);
    GRID.innerHTML = items.map(card).join('') || `<p class="muted">No items yet.</p>`;
    // Focus management for a11y
    const first = GRID.querySelector('.article-card a');
    if (first) first.setAttribute('tabindex', '-1');
  };

  const activate = (filter) => {
    TABS.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === filter));
  };

  // Event: filter tabs
  TABS.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      activate(f);
      render(f);
      history.replaceState(null, '', f === 'all' ? '#all' : `#${f}`);
    });
  });

  // Load JSON and initialize
  fetch('assets/blogs.json')
    .then(r => r.json())
    .then(json => {
      DATA = json.sort((a,b) => (a.date < b.date ? 1 : -1)); // newest first
      const initial = HASH_TO_FILTER[location.hash] || 'all';
      activate(initial);
      render(initial);
    })
    .catch(() => {
      GRID.innerHTML = `<p class="muted">Couldn’t load items yet.</p>`;
    });
})();
