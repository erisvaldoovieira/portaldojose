document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('main-navigation');
    const setMenu = open => {
        nav.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            toggle.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.main-header')) setMenu(false);
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
        if (event.matches) setMenu(false);
    });

    const grid = document.getElementById('youtube-videos-grid');
    const status = document.getElementById('video-status');
    const cacheKey = 'portal-jose-videos-v1';
    const channelId = 'UCELku_rf-FHbWhLIwsKLGGA';
    const videoId = link => {
        try {
            const url = new URL(link);
            if (url.protocol !== 'https:') return null;
            const host = url.hostname.toLowerCase();
            let id;
            if (host === 'youtu.be') id = url.pathname.slice(1);
            else if (host === 'youtube.com' || host === 'www.youtube.com') {
                id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:shorts|embed)\/([a-zA-Z0-9_-]{11})$/)?.[1];
            }
            return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : null;
        } catch { return null; }
    };
    const normalize = items => {
        if (!Array.isArray(items)) return [];
        const seen = new Set();
        return items.flatMap(item => {
            if (!item || typeof item.title !== 'string' || typeof item.link !== 'string') return [];
            const id = videoId(item.link);
            if (!id || !item.title.trim() || seen.has(id)) return [];
            seen.add(id);
            return [{id, title: item.title.trim().slice(0, 300), link: `https://www.youtube.com/watch?v=${id}`}];
        }).slice(0, 3);
    };
    const render = videos => {
        const fragment = document.createDocumentFragment();
        videos.forEach(video => {
            const card = document.createElement('article');
            card.className = 'video-card';
            const link = document.createElement('a');
            link.className = 'video-link';
            link.href = `https://www.youtube.com/watch?v=${video.id}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            const wrapper = document.createElement('div');
            wrapper.className = 'thumbnail-wrapper';
            const img = document.createElement('img');
            img.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            img.alt = '';
            img.width = 480;
            img.height = 360;
            img.loading = 'lazy';
            img.decoding = 'async';
            const overlay = document.createElement('div');
            overlay.className = 'play-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            const play = document.createElement('span');
            play.className = 'play-icon';
            play.textContent = '▶';
            overlay.append(play);
            wrapper.append(img, overlay);
            const info = document.createElement('div');
            info.className = 'video-info';
            const title = document.createElement('h3');
            title.className = 'video-title';
            title.textContent = video.title;
            info.append(title);
            link.append(wrapper, info);
            card.append(link);
            fragment.append(card);
        });
        grid.replaceChildren(fragment);
    };
    let cached = [];
    try {
        cached = normalize(JSON.parse(localStorage.getItem(cacheKey) || '[]'));
        if (cached.length) render(cached);
    } catch { /* Storage may be disabled. The channel link remains available. */ }
    status.textContent = cached.length ? 'Exibindo vídeos salvos. Buscando atualizações…' : 'Buscando os vídeos mais recentes…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const rss = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`, {signal: controller.signal})
        .then(response => {
            if (!response.ok) throw new Error('Feed unavailable');
            return response.json();
        })
        .then(data => {
            if (data.status !== 'ok') throw new Error('Invalid feed');
            const videos = normalize(data.items);
            if (!videos.length) throw new Error('Empty feed');
            render(videos);
            status.textContent = 'Últimos vídeos disponíveis no feed do canal.';
            try { localStorage.setItem(cacheKey, JSON.stringify(videos)); } catch { /* Optional cache. */ }
        })
        .catch(() => {
            status.textContent = cached.length
                ? 'Não foi possível atualizar agora. Exibindo os últimos vídeos salvos neste navegador.'
                : 'Não foi possível atualizar os vídeos agora. Acesse o canal pelo link abaixo.';
        })
        .finally(() => clearTimeout(timeout));
});
