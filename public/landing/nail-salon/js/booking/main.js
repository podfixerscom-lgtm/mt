/* Booking flow controller: renders a step, handles taps, validates, confirms. */

import {
    createStore, STEPS, STEP_TITLES, canLeaveStep, validateDetails,
    getTotals, getDay, getArtist, formatMoney
} from './state.js';
import { renderStep } from './render.js';
import { renderDetails, renderConfirmation } from './render-details.js';

const host = document.getElementById('stepHost');
const hint = document.getElementById('hintOut');
const progressFill = document.getElementById('progressFill');
const totalOut = document.getElementById('totalOut');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('appbarBack');
const barTitle = document.getElementById('barTitle');
const barStep = document.getElementById('barStep');
const actionsBar = document.getElementById('actions');

const store = createStore();

const HINTS = {
    service: 'Pick a set to continue.',
    time: 'Pick a time to continue.'
};

function setHint(message) {
    hint.textContent = message ?? '';
}

function fillDetailValues(state) {
    Object.entries(state.details).forEach(([field, value]) => {
        const input = host.querySelector(`[data-field="${field}"]`);
        if (input) input.value = value;
    });
}

function fillConfirmation(state) {
    host.querySelectorAll('[data-out]').forEach((node) => {
        node.textContent = state.details[node.dataset.out] || '—';
    });
}

function updateChrome(state) {
    const totals = getTotals(state);
    const stepNumber = Math.min(state.step + 1, STEPS.length);

    totalOut.textContent = formatMoney(totals.price);
    progressFill.style.width = `${Math.round((stepNumber / STEPS.length) * 100)}%`;
    barStep.textContent = `${String(stepNumber).padStart(2, '0')} / ${String(STEPS.length).padStart(2, '0')}`;
    barTitle.textContent = state.confirmed ? 'Booked' : STEP_TITLES[STEPS[state.step]];

    actionsBar.hidden = state.confirmed;
    nextBtn.textContent = state.step === STEPS.length - 1 ? 'Confirm booking' : 'Continue';
    document.title = `${state.confirmed ? 'Booked' : barTitle.textContent} — NAIL BAR`;
}

function render() {
    const state = store.get();

    if (state.confirmed) {
        const totals = getTotals(state);
        host.innerHTML = renderConfirmation(state, totals, getDay(state), getArtist(state));
        fillConfirmation(state);
    } else if (state.step === STEPS.length - 1) {
        host.innerHTML = renderDetails(state);
        fillDetailValues(state);
    } else {
        host.innerHTML = renderStep(state);
    }

    updateChrome(state);
    setHint(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function advance() {
    const state = store.get();

    if (state.step === STEPS.length - 1) {
        const errors = validateDetails(state.details);

        if (Object.keys(errors).length > 0) {
            store.patch({ errors });
            host.querySelector('.field--bad .input')?.focus();
            return;
        }

        store.confirm();
        return;
    }

    if (!canLeaveStep(state)) {
        setHint(HINTS[STEPS[state.step]] ?? 'Finish this step to continue.');
        return;
    }

    store.goTo(state.step + 1);
}

function stepBack() {
    const state = store.get();

    if (state.confirmed || state.step === 0) {
        window.location.href = 'index.html';
        return;
    }

    store.goTo(state.step - 1);
}

function handleAction(action, id) {
    const state = store.get();
    const dayIndex = state.days.findIndex((day) => day.key === state.dayKey);
    const nextDay = state.days[(dayIndex + 1) % state.days.length];

    switch (action) {
        case 'service':
            store.patch({ serviceId: id, slot: null });
            break;
        case 'addon':
            store.toggleAddon(id);
            store.patch({ slot: null });
            break;
        case 'shape':
            store.patch({ shapeId: id });
            break;
        case 'length':
            store.patch({ lengthId: id, slot: null });
            break;
        case 'artist':
            store.patch({ artistId: id });
            break;
        case 'day':
            store.patch({ dayKey: id, slot: null });
            break;
        case 'slot':
            store.patch({ slot: id });
            break;
        case 'next-day':
            store.patch({ dayKey: nextDay.key, slot: null });
            break;
        case 'restart':
            window.location.href = 'book.html';
            break;
        default:
            break;
    }
}

host.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger || trigger.disabled) return;
    handleAction(trigger.dataset.action, trigger.dataset.id);
});

host.addEventListener('input', (event) => {
    const field = event.target.dataset.field;
    if (!field) return;

    store.get().details[field] = event.target.value;
    const wrap = host.querySelector(`[data-field-wrap="${field}"]`);
    wrap?.classList.remove('field--bad');
    wrap?.querySelector('[data-error]')?.remove();
});

nextBtn.addEventListener('click', advance);
backBtn.addEventListener('click', stepBack);

store.subscribe(render);
render();
