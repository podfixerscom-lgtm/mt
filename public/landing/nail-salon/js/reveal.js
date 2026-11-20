/* reveal.js — scroll reveal for Theme Pack.
   Markup: <div data-reveal="theme" data-reveal-index="0">…</div>
     data-reveal        keyframe name, or "theme" for --tp-reveal
     data-reveal-index  stagger position (index x --tp-stagger)
     data-reveal-dur    override --tp-dur-slow
   Reveals fire once. Never on nav, tab bars or above-the-fold chrome. */
export function initReveals(scope = document) {
    if (!window.IntersectionObserver) return () => { };

    const groups = new Map();

    scope.querySelectorAll('[data-reveal]').forEach((el) => {
        el.style.animation = 'none';
        el.style.opacity = '0';

        const scroller = el.closest('[data-reveal-root]') || null;
        if (!groups.has(scroller)) groups.set(scroller, []);
        groups.get(scroller).push(el);
    });

    const observers = [];

    groups.forEach((els, scroller) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const styles = getComputedStyle(document.documentElement);

                const name = el.dataset.reveal === 'theme'
                    ? (styles.getPropertyValue('--tp-reveal').trim() || 'tp-up')
                    : el.dataset.reveal;
                const duration = el.dataset.revealDur || styles.getPropertyValue('--tp-dur-slow').trim() || '500ms';
                const easing = styles.getPropertyValue('--tp-ease').trim() || 'ease';
                const stagger = Number.parseFloat(styles.getPropertyValue('--tp-stagger')) || 60;
                const index = Number(el.dataset.revealIndex || 0);

                el.style.opacity = '';
                el.style.animation = `${name} ${duration} ${easing} ${Math.round(index * stagger)}ms both`;
                observer.unobserve(el);
            });
        }, { root: scroller, threshold: 0.2 });

        els.forEach((el) => observer.observe(el));
        observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
}
