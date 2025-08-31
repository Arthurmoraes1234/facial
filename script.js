document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.app-content section');
    const helpButton = document.querySelector('.btn-help');
    const memorizeVerseButton = document.querySelector('.btn-memorize');
    const starsCountSpan = document.querySelector('.stars');
    const printPosterButton = document.querySelector('.btn-print-poster');
    const printCertificateButton = document.querySelector('.btn-print-certificate');

    let currentStars = 0; // Para a gamificação

    // Função para mostrar a seção correta e ativar o item da navegação
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });
        document.getElementById(sectionId).classList.add('active-section');
        document.getElementById(sectionId).classList.remove('hidden-section');

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }

    // Inicializa a seção de home
    showSection('home');

    // Event listeners para a navegação
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;
            showSection(sectionId);
            // Atualiza a URL para PWA - navegação de estado sem recarregar a página
            history.pushState({ section: sectionId }, sectionId, `#${sectionId}`);
        });
    });

    // Lidar com a navegação do navegador (botão voltar/avançar)
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.section) {
            showSection(event.state.section);
        } else {
            // Se não houver estado, volte para a home
            showSection('home');
        }
    });

    // Lógica para o botão de Ajuda (WhatsApp)
    helpButton.addEventListener('click', () => {
        const whatsappUrl = 'https://wa.me/55XXYYYYYYYYY?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20o%20Clube%20Crist%C3%A3o%20Infantil!';
        window.open(whatsappUrl, '_blank');
    });

    // Lógica para memorizar versículo (Gamificação)
    memorizeVerseButton.addEventListener('click', () => {
        currentStars += 5; // Exemplo: 5 estrelas por memorizar
        updateStarsDisplay();
        alert('Parabéns! Você ganhou 5 Estrelinhas de Fé por memorizar o versículo!');
        // Adicionar animação aqui
    });

    // Atualizar exibição das estrelas
    function updateStarsDisplay() {
        starsCountSpan.textContent = `⭐ ${currentStars} Estrelinhas de Fé`;
        document.querySelector('.gamificacao .stars-count').textContent = currentStars;
    }

    // Lógica para os botões de Play (YouTube Embed)
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const youtubeId = e.target.dataset.youtubeId;
            if (youtubeId) {
                const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
                // Cria um iframe e o adiciona à seção ou a um modal
                const videoPlayer = document.createElement('iframe');
                videoPlayer.src = embedUrl;
                videoPlayer.width = "100%";
                videoPlayer.height = "315";
                videoPlayer.allow = "autoplay; encrypted-media";
                videoPlayer.allowFullscreen = true;
                videoPlayer.frameBorder = "0";

                // Exemplo simples: substitui o botão por um iframe
                const parent = e.target.closest('.music-item') || e.target.closest('.video-item');
                if (parent) {
                    parent.innerHTML = ''; // Limpa o conteúdo do item
                    parent.appendChild(videoPlayer);
                    currentStars += 1; // Exemplo: 1 estrela por assistir
                    updateStarsDisplay();
                }
            }
        });
    });

    // Lógica para o Cartaz Diário (apenas UI de exemplo)
    const dailyPosterTasks = document.querySelectorAll('.daily-poster input[type="checkbox"]');
    dailyPosterTasks.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                currentStars += 1; // Exemplo: 1 estrela por tarefa
                updateStarsDisplay();
            } else {
                currentStars = Math.max(0, currentStars - 1); // Remove estrela se desmarcar
                updateStarsDisplay();
            }
        });
    });

    printPosterButton.addEventListener('click', () => {
        alert('Funcionalidade de impressão do cartaz seria implementada aqui!');
        // Abrir nova janela com versão de impressão ou usar API de impressão do navegador
        // window.print(); (com CSS específico para impressão)
    });

    printCertificateButton.addEventListener('click', () => {
        alert('Funcionalidade de impressão de certificado seria implementada aqui!');
    });

    // Service Worker para PWA (para funcionar offline e como app instalável)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.