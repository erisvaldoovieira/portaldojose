document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navList = document.querySelector('.nav-list');

    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    });

    // Header scroll effect
    const header = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Simple smooth scrolling for anchor links (if browser doesn't support css smooth-scroll)
    // CSS scroll-behavior: smooth handles most cases, but this is a fallback/enhancement.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // Fetch latest YouTube videos
    const channelId = 'UCELku_rf-FHbWhLIwsKLGGA';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const videosGrid = document.getElementById('youtube-videos-grid');
            if (!videosGrid) return;

            if (data.status === 'ok' && data.items.length > 0) {
                videosGrid.innerHTML = ''; // Clear loading text
                
                // Get the latest 3 videos
                const latestVideos = data.items.slice(0, 3);
                
                latestVideos.forEach(video => {
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card thumbnail-card';
                    
                    // Extrair ID do vídeo usando Regex (mais robusto)
                    let videoId = '';
                    const match = video.link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                    if (match && match[1]) {
                        videoId = match[1];
                    }
                    
                    // Usar miniatura do YouTube diretamente
                    const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : video.thumbnail;
                    
                    videoCard.innerHTML = `
                        <a href="${video.link}" target="_blank" rel="noopener noreferrer" class="video-link">
                            <div class="video-wrapper thumbnail-wrapper">
                                <img src="${thumbnailUrl}" alt="${video.title}">
                                <div class="play-overlay">
                                    <div class="play-icon">▶</div>
                                </div>
                            </div>
                            <div class="video-info">
                                <h3 class="video-title">${video.title}</h3>
                            </div>
                        </a>
                    `;
                    videosGrid.appendChild(videoCard);
                });
            } else {
                videosGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">Não foi possível carregar os vídeos recentes no momento.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
            const videosGrid = document.getElementById('youtube-videos-grid');
            if (videosGrid) {
                videosGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">Erro ao carregar os vídeos.</p>';
            }
        });
});
