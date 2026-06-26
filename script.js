document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress-bar');
    const counter = document.getElementById('counter');
    const totalSlidesElem = document.getElementById('total-slides');
    const btnPrev = document.getElementById('prev-btn');
    const btnNext = document.getElementById('next-btn');

    // Validação de segurança: interrompe se os elementos essenciais não existirem
    if (!slides.length || !btnPrev || !btnNext) return;

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // Inicializa o total de slides (formatado com 2 dígitos)
    if (totalSlidesElem) {
        totalSlidesElem.textContent = String(totalSlides).padStart(2, '0');
    }

    // Inicializa a acessibilidade dos slides ocultos no carregamento
    slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });

    function updateUI() {
        // Atualiza o contador numérico
        if (counter) {
            counter.textContent = String(currentSlideIndex + 1).padStart(2, '0');
        }

        // Atualiza a barra de progresso superior
        if (progressBar) {
            const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Controle de estado dos botões (desabilita nos limites)
        btnPrev.disabled = currentSlideIndex === 0;
        btnNext.disabled = currentSlideIndex === totalSlides - 1;
    }

    function goToSlide(newIndex) {
        // Evita transições fora dos limites
        if (newIndex < 0 || newIndex >= totalSlides) return;

        // Oculta o slide atual
        const currentSlide = slides[currentSlideIndex];
        currentSlide.classList.remove('active');
        currentSlide.setAttribute('aria-hidden', 'true');

        // Atualiza o índice
        currentSlideIndex = newIndex;

        // Mostra o novo slide
        const newSlide = slides[currentSlideIndex];
        newSlide.classList.add('active');
        newSlide.setAttribute('aria-hidden', 'false');
        newSlide.scrollTop = 0; // Reseta o scroll para o topo ao focar no slide

        // Atualiza a interface (barra e contadores)
        updateUI();
    }

    // Funções auxiliares de navegação
    function nextSlide() { goToSlide(currentSlideIndex + 1); }
    function prevSlide() { goToSlide(currentSlideIndex - 1); }

    // Eventos de clique nos controles virtuais
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    // Mapeamento de Teclas Físicas (Setas e Espaço)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });

    // --- Suporte a Swipe para Dispositivos Móveis ---
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // Distância mínima (em px) para considerar um swipe
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide(); // Deslizou para a esquerda -> Avança
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide(); // Deslizou para a direita -> Volta
        }
    }

    // Inicialização da interface (Engine)
    updateUI();
});