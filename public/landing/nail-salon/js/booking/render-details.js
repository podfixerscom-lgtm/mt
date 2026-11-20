/* Details step + confirmation. User text is written with textContent by the caller,
   never interpolated into markup. */

import { ICONS } from './parts.js';
import { formatMoney, formatDuration } from './state.js';

function field({ field, label, type, hint, error, placeholder, autocomplete }) {
    return `<div class="field ${error ? 'field--bad' : ''}" data-field-wrap="${field}">
        <label for="f-${field}">${label}${hint ? ` <em>${hint}</em>` : ''}</label>
        <input class="input" id="f-${field}" type="${type}" data-field="${field}"
            placeholder="${placeholder}" autocomplete="${autocomplete}" inputmode="${type === 'tel' ? 'tel' : 'text'}">
        ${error ? `<span class="field__error" data-error="${field}">${error}</span>` : ''}
    </div>`;
}

export function renderDetails(state) {
    const errors = state.errors;

    return `<div class="step" data-step="details">
        <header class="step__head">
            <span class="mono" style="color:var(--tp-acc)">Step 05</span>
            <h1 class="display display--sm">Who is the set for?</h1>
            <p>One number so the artist can text you if the chair runs late. No deposit, nothing due now.</p>
        </header>

        <div class="fields">
            ${field({ field: 'name', label: 'Name', type: 'text', error: errors.name, placeholder: 'Mahira Rahman', autocomplete: 'name' })}
            ${field({ field: 'phone', label: 'Phone', hint: 'WhatsApp is fine', type: 'tel', error: errors.phone, placeholder: '01700 000000', autocomplete: 'tel' })}
            ${field({ field: 'email', label: 'Email', hint: 'optional', type: 'email', error: errors.email, placeholder: 'you@email.com', autocomplete: 'email' })}
            <div class="field">
                <label for="f-notes">Notes <em>optional</em></label>
                <textarea class="input" id="f-notes" data-field="notes" placeholder="Inspo, allergies, anything the artist should know"></textarea>
            </div>
        </div>

        <div class="legend">
            <span>${ICONS.clock} Hold the chair for 15 minutes</span>
            <span>${ICONS.check} Free cancel up to 12 hours before</span>
        </div>
    </div>`;
}

export function renderConfirmation(state, totals, day, artist) {
    const service = totals.service;
    const addonLabel = totals.addons.length
        ? totals.addons.map((addon) => addon.name).join(', ')
        : 'No extras';

    return `<div class="done" data-step="done">
        <div class="done__seal">${ICONS.check}</div>
        <h1 class="display">You're booked.</h1>
        <p class="lede">Fresh set, fresh mood — we've texted the studio. Come 5 minutes early and we'll start on time.</p>

        <div class="done__card">
            <div class="done__row"><span>Name</span><b data-out="name"></b></div>
            <div class="done__row"><span>Phone</span><b data-out="phone"></b></div>
            <div class="done__row"><span>Set</span><b>${service ? service.name : '—'}</b></div>
            <div class="done__row"><span>Extras</span><b>${addonLabel}</b></div>
            <div class="done__row"><span>Artist</span><b>${artist.name}</b></div>
            <div class="done__row"><span>When</span><b>${day.label} · ${state.slot ?? '—'}</b></div>
            <div class="done__row"><span>Duration</span><b>${formatDuration(totals.minutes)}</b></div>
            <div class="done__row"><span>Pay at studio</span><b>${formatMoney(totals.price)}</b></div>
        </div>

        <div class="done__actions">
            <a class="btn btn--primary" href="index.html">Back to the bar</a>
            <button type="button" class="btn btn--ghost" data-action="restart">Book another set</button>
        </div>
  </div>`;
}
