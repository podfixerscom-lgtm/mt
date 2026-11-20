/* Small markup builders shared by the booking steps. */

export const ICONS = {
    check: '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    arrowRight: '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowLeft: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    clock: '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    sparkle: '<svg class="icon icon--lg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.4 5.3 5.6.6-4.2 3.9 1.2 5.6L12 15.6 7 18.4l1.2-5.6L4 8.9l5.6-.6z"/></svg>',
    pin: '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>'
};

export function stepHead(title, blurb) {
    return `<header class="step__head">
        <span class="mono" style="color:var(--tp-acc)">Step</span>
        <h1 class="display display--sm">${title}</h1>
        <p>${blurb}</p>
    </header>`;
}

export function pickTile({ id, label, meta, tag, pressed, action }) {
    const badge = tag ? `<span class="pick__tag">${tag}</span>` : '';
    return `<button type="button" class="pick" aria-pressed="${pressed}" data-action="${action}" data-id="${id}">
        ${badge}
        <span class="pick__name">${label}</span>
        <span class="pick__meta">${meta}</span>
        <span class="pick__tick">${ICONS.check}</span>
    </button>`;
}

export function chip({ id, label, meta, pressed, action }) {
    const small = meta ? `<small>${meta}</small>` : '';
    return `<button type="button" class="chip" aria-pressed="${pressed}" data-action="${action}" data-id="${id}">${label}${small}</button>`;
}

export function skeletonTiles(count = 4) {
    return `<div class="picks">${Array.from({ length: count }, () => '<div class="skel skel--tile"></div>').join('')}</div>`;
}

export function emptyState(title, body, actionLabel) {
    return `<div class="empty">
        <h3>${title}</h3>
        <p>${body}</p>
        <button type="button" class="btn btn--ghost btn--sm" data-action="${actionLabel.action}">${actionLabel.label}</button>
    </div>`;
}
