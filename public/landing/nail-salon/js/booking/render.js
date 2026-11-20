/* Step markup for the NAIL BAR booking flow. */
import { SERVICES, ADDONS, SHAPES, LENGTHS, ARTISTS } from './data.js';
import { stepHead, pickTile, chip, ICONS, emptyState } from './parts.js';
import { getTotals, getSlots, formatMoney, formatDuration } from './state.js';

function summaryCard(totals) {
    const extras = totals.addons.length
        ? totals.addons.map((addon) => addon.name).join(' · ')
        : 'No extras';

    return `<div class="summary">
    <div class="sumline"><span>${totals.service ? totals.service.name : 'Pick a set'}</span><b>${formatMoney(totals.service ? totals.service.price : 0)}</b></div>
    <div class="sumline"><span>Extras</span><b>${extras}</b></div>
    <div class="sumline"><span>Length</span><b>${totals.length.name}${totals.length.price ? ` · ${formatMoney(totals.length.price)}` : ''}</b></div>
    <div class="sumline sumline--total"><span>${formatDuration(totals.minutes)} in the chair</span><b>${formatMoney(totals.price)}</b></div>
  </div>`;
}

function renderService(state) {
    const totals = getTotals(state);

    const tiles = SERVICES.map((service) => pickTile({
        id: service.id,
        label: service.name,
        meta: `${formatMoney(service.price)} · ${service.minutes} min`,
        tag: service.tag,
        pressed: state.serviceId === service.id,
        action: 'service'
    })).join('');

    const addonChips = ADDONS.map((addon) => chip({
        id: addon.id,
        label: addon.name,
        meta: `+${formatMoney(addon.price)}`,
        pressed: state.addonIds.includes(addon.id),
        action: 'addon'
    })).join('');

    return `<div class="step" data-step="service">
    ${stepHead('Pick your set.', 'Fixed price, fixed time. Extras are optional — the base set already includes prep, shape, colour, cure and oil.')}
    <div class="picks">${tiles}</div>
    <div class="stack">
      <span class="mono muted">Extras</span>
      <div class="chips">${addonChips}</div>
    </div>
    ${summaryCard(totals)}
  </div>`;
}

function renderShape(state) {
    const shapeChips = SHAPES.map((shape) => chip({
        id: shape.id,
        label: shape.name,
        pressed: state.shapeId === shape.id,
        action: 'shape'
    })).join('');

    const lengthChips = LENGTHS.map((length) => chip({
        id: length.id,
        label: length.name,
        meta: length.price ? `+${formatMoney(length.price)}` : 'included',
        pressed: state.lengthId === length.id,
        action: 'length'
    })).join('');

    return `<div class="step" data-step="shape">
    ${stepHead('Shape and length.', 'Square and almond sit closest to the natural nail. Coffin and long are statement territory.')}
    <div class="stack">
      <span class="mono muted">Shape</span>
      <div class="chips">${shapeChips}</div>
    </div>
    <div class="stack">
      <span class="mono muted">Length</span>
      <div class="chips">${lengthChips}</div>
    </div>
    ${summaryCard(getTotals(state))}
  </div>`;
}

function renderArtist(state) {
    const rows = ARTISTS.map((artist) => `<button type="button" class="arow" aria-pressed="${state.artistId === artist.id}" data-action="artist" data-id="${artist.id}">
    <span class="avatar">${artist.initials}</span>
    <span class="arow__body">
      <b>${artist.name}</b>
      <span>${artist.note}${artist.rating ? ` · ${artist.rating} ★` : ''}</span>
    </span>
    <span class="arow__radio">${ICONS.check}</span>
  </button>`).join('');

    return `<div class="step" data-step="artist">
    ${stepHead('Who is doing the set?', 'Both artists work builder gel only. Pick one if you want the same hands every time — otherwise we assign the first free chair.')}
    <div class="stack">${rows}</div>
  </div>`;
}

function renderTime(state) {
    const totals = getTotals(state);
    const slots = getSlots(state);
    const available = slots.filter((slot) => slot.available);

    const days = state.days.map((day) => `<button type="button" class="day" aria-pressed="${state.dayKey === day.key}" data-action="day" data-id="${day.key}">
    <span>${day.weekday}</span><b>${day.dayNumber}</b><span>${day.month}</span>
  </button>`).join('');

    const grid = available.length
        ? `<div class="slots">${slots.map((slot) => `<button type="button" class="slot" ${slot.available ? '' : 'disabled'} aria-pressed="${state.slot === slot.value}" data-action="slot" data-id="${slot.value}">${slot.value}</button>`).join('')}</div>
    <div class="legend">
      <span><i></i> Free</span>
      <span><i class="off"></i> Booked</span>
      <span>${ICONS.clock} ${formatDuration(totals.minutes)} needed</span>
    </div>`
        : emptyState(
            'Nothing left that day.',
            'Every slot is taken or too short for this set. Try the next day — the rail scrolls.',
            { action: 'next-day', label: 'Try the next day' }
        );

    return `<div class="step" data-step="time">
    ${stepHead('Date and time.', 'Slots are 30 minutes apart, and the last one leaves enough time to cure before we close at 8pm.')}
    <div class="stack">
      <span class="mono muted">Day</span>
      <div class="dayrail">${days}</div>
    </div>
    <div class="stack">
      <span class="mono muted">Time</span>
      ${grid}
    </div>
  </div>`;
}

export function renderStep(state) {
    if (state.step === 0) return renderService(state);
    if (state.step === 1) return renderShape(state);
    if (state.step === 2) return renderArtist(state);
    return renderTime(state);
}
