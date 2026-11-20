/* NAIL BAR — landing behaviour: mobile sheet + scroll reveals. */
import { initReveals } from './reveal.js';

const sheet = document.getElementById('sheetMenu');
const openButton = document.getElementById('menuOpen');
const closeButton = document.getElementById('menuClose');

function openSheet() {
    if (!sheet || !openButton) return;
    sheet.hidden = false;
    openButton.setAttribute('aria-expanded', 'true');
    closeButton?.focus();
}

function closeSheet() {
    if (!sheet || !openButton) return;
    sheet.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
    openButton.focus();
}

openButton?.addEventListener('click', openSheet);
closeButton?.addEventListener('click', closeSheet);

sheet?.addEventListener('click', (event) => {
    if (event.target === sheet) closeSheet();
});

sheet?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeSheet));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sheet && !sheet.hidden) closeSheet();
});

initReveals(document);
