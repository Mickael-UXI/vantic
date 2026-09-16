/* ==========================================================================
   VANTIC — script.js
   JavaScript puro (sem dependências). Organizado por responsabilidade:
   1. Menu mobile
   2. Nós ativos por seção + linha de fluxo (progresso real no scroll)
   3. Revelação em cascata ao rolar (hero + seções)
   4. Console do hero: contadores e "tempo real" simulado nas linhas de status
   5. Diagrama "como funciona": nada em JS, animação é só CSS
   6. Depoimentos: pausa acessível do auto-scroll
   7. Formulário do CTA final + brilho que acompanha o mouse
   8. Ano do rodapé
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * 1. MENU MOBILE
   * ------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.classList.toggle('is-open', !isOpen);
    mobileMenu.hidden = isOpen ? true : false;
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.hidden = true;
    });
  });

  /* ------------------------------------------------------------------ *
   * 2. NÓS DA LINHA DE FLUXO + progresso real no scroll
   * A trilha (.flow-track) recebe uma variável CSS --flow-progress de
   * 0 a 1, calculada pela posição de scroll dentro da trilha — a linha
   * âmbar "acende" de cima para baixo conforme o usuário avança na página.
   * ------------------------------------------------------------------ */
  const flowTrack = document.querySelector('.flow-track');
  let ticking = false;

  function updateFlowProgress() {
    if (!flowTrack) return;
    const rect = flowTrack.getBoundingClientRect();
    const trackHeight = flowTrack.offsetHeight;
    const viewportH = window.innerHeight;

    const scrolled = viewportH * 0.5 - rect.top;
    const progress = Math.min(Math.max(scrolled / trackHeight, 0), 1);

    flowTrack.style.setProperty('--flow-progress', progress.toFixed(3));
    ticking = false;
  }

  function requestFlowUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateFlowProgress);
      ticking = true;
    }
  }

  if (flowTrack) {
    window.addEventListener('scroll', requestFlowUpdate, { passive: true });
    window.addEventListener('resize', requestFlowUpdate);
    updateFlowProgress();
  }

  const featuresGrid = document.querySelector('.features-grid');
  const consoleEl = document.querySelector('.console');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const node = entry.target.querySelector('.flow-node');
        if (node) node.classList.toggle('is-active', entry.isIntersecting);

        if (entry.target === featuresGrid?.closest('section') && entry.isIntersecting) {
          featuresGrid.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.flow-track > section').forEach((section) => {
    sectionObserver.observe(section);
  });

  /* ------------------------------------------------------------------ *
   * 3. REVELAÇÃO EM CASCATA
   * 3a. Hero: badge, título, subtítulo, ações, métricas e console entram
   *     em sequência no carregamento (um único momento orquestrado).
   * 3b. Demais seções: título/lead e os itens de cada grupo (features,
   *     passos, preços, depoimentos) ganham a classe .reveal e sobem
   *     suavemente, em cascata, quando entram na tela.
   * ------------------------------------------------------------------ */
  const heroEnterTargets = [
    '.hero-badge',
    '.hero-title',
    '.hero-subtitle',
    '.hero-actions',
    '.hero-meta',
    '.hero-visual .console',
  ];

  heroEnterTargets.forEach((selector, index) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('hero-enter');
    el.style.setProperty('--enter-delay', `${index * 90}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.section-head').forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  ['.step-item', '.price-card'].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${index * 110}ms`);
      revealObserver.observe(el);
    });
  });

  document.querySelectorAll('.how-visual, #cta .cta-section').forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* ------------------------------------------------------------------ *
   * 3. CONSOLE DO HERO
   * 3a. Contadores sobem de 0 até o valor real quando o console entra em cena.
   * 3b. As linhas da tabela alternam de status para simular atividade —
   *     pausado se o usuário preferir menos movimento.
   * ------------------------------------------------------------------ */
  const metricValues = document.querySelectorAll('.metric-value');

  function animateCount(el) {
    const target = Number(el.dataset.target || 0);
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (consoleEl) {
    const consoleObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            metricValues.forEach(animateCount);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    consoleObserver.observe(consoleEl);
  }

  const STATUS_CYCLE = {
    progress: { next: 'done', label: 'Concluído' },
    done: { next: 'progress', label: 'Em andamento' },
    late: { next: 'progress', label: 'Em andamento' },
  };

  const consoleRows = document.querySelectorAll('.console-row[data-status]');

  function cycleRowStatus() {
    if (!consoleRows.length) return;
    const row = consoleRows[Math.floor(Math.random() * consoleRows.length)];
    const current = row.dataset.status;
    const step = STATUS_CYCLE[current];
    if (!step) return;

    const pill = row.querySelector('.status-pill');
    if (!pill) return;

    pill.className = `status-pill status-pill--${step.next}`;
    pill.textContent = step.label;
    row.dataset.status = step.next;

    row.classList.add('just-updated');
    setTimeout(() => row.classList.remove('just-updated'), 900);
  }

  if (!prefersReducedMotion && consoleRows.length) {
    setInterval(cycleRowStatus, 3600);
  }

  /* ------------------------------------------------------------------ *
   * 4. DEPOIMENTOS — pausa o auto-scroll ao focar via teclado
   * (o hover já é tratado só em CSS; aqui cobrimos navegação por Tab)
   * ------------------------------------------------------------------ */
  const scroller = document.querySelector('.testimonials-scroller');
  if (scroller) {
    scroller.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('focus', () => (scroller.style.animationPlayState = 'paused'));
      el.addEventListener('blur', () => (scroller.style.animationPlayState = 'running'));
    });
  }

  /* ------------------------------------------------------------------ *
   * 5. FORMULÁRIO DO CTA FINAL
   * Sem backend nesta entrega — apenas valida e dá feedback inline.
   * ------------------------------------------------------------------ */
  const ctaForm = document.getElementById('cta-form');
  const ctaFeedback = document.getElementById('cta-feedback');

  ctaForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = ctaForm.querySelector('input[type="email"]').value.trim();

    if (!email) {
      ctaFeedback.textContent = 'Digite um e-mail para continuar.';
      return;
    }

    ctaFeedback.textContent = `Pronto! Entraremos em contato em ${email}.`;
    ctaForm.reset();
  });

  /* ------------------------------------------------------------------ *
   * 7b. BRILHO QUE ACOMPANHA O MOUSE NO CTA FINAL
   * ------------------------------------------------------------------ */
  const ctaSection = document.querySelector('.cta-section');
  if (ctaSection && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    ctaSection.addEventListener('mousemove', (event) => {
      const rect = ctaSection.getBoundingClientRect();
      const mx = ((event.clientX - rect.left) / rect.width) * 100;
      const my = ((event.clientY - rect.top) / rect.height) * 100;
      ctaSection.style.setProperty('--mx', `${mx}%`);
      ctaSection.style.setProperty('--my', `${my}%`);
    });
  }

  /* ------------------------------------------------------------------ *
   * 8. ANO DO RODAPÉ
   * ------------------------------------------------------------------ */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
