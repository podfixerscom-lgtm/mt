/* Booking state: selections, derived price/duration, field validation. */

import { SERVICES, ADDONS, LENGTHS, ARTISTS, buildDays, buildSlots } from './data.js';

export const STEPS = ['service', 'shape', 'artist', 'time', 'details'];
export const STEP_TITLES = {
    service: 'The set',
    shape: 'Shape & length',
    artist: 'Your artist',
    time: 'Date & time',
    details: 'Your details'
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function initialState() {
    const days = buildDays(10);
    const params = new URLSearchParams(window.location.search);
    const preselect = params.get('set');
    const service = SERVICES.find((item) => item.id === preselect);

    return {
        step: 0,
        confirmed: false,
        days,
        serviceId: service ? service.id : null,
        addonIds: [],
        shapeId: 'almond',
        lengthId: 'short',
        artistId: 'any',
        dayKey: days[0].key,
        slot: null,
        details: { name: '', phone: '', email: '', notes: '' },
        errors: {}
    };
}

export function createStore() {
    const state = initialState();
    const listeners = new Set();

    function notify() {
        listeners.forEach((listener) => listener(state));
    }

    return {
        get() {
            return state;
        },

        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },

        patch(partial) {
            Object.assign(state, partial);
            notify();
        },

        toggleAddon(addonId) {
            state.addonIds = state.addonIds.includes(addonId)
                ? state.addonIds.filter((id) => id !== addonId)
                : [...state.addonIds, addonId];
            notify();
        },

        setDetail(field, value) {
            state.details = { ...state.details, [field]: value };
            state.errors = { ...state.errors, [field]: undefined };
            notify();
        },

        goTo(stepIndex) {
            state.step = Math.max(0, Math.min(STEPS.length - 1, stepIndex));
            state.errors = {};
            notify();
        },

        confirm() {
            state.confirmed = true;
            notify();
        }
    };
}

/* ---------- derived ---------- */

export function getService(state) {
    return SERVICES.find((item) => item.id === state.serviceId) ?? null;
}

export function getAddons(state) {
    return ADDONS.filter((item) => state.addonIds.includes(item.id));
}

export function getLength(state) {
    return LENGTHS.find((item) => item.id === state.lengthId) ?? LENGTHS[0];
}

export function getArtist(state) {
    return ARTISTS.find((item) => item.id === state.artistId) ?? ARTISTS[0];
}

export function getDay(state) {
    return state.days.find((day) => day.key === state.dayKey) ?? state.days[0];
}

export function getTotals(state) {
    const service = getService(state);
    const addons = getAddons(state);
    const length = getLength(state);

    const price = (service?.price ?? 0)
        + addons.reduce((sum, addon) => sum + addon.price, 0)
        + length.price;

    const minutes = (service?.minutes ?? 0)
        + addons.reduce((sum, addon) => sum + addon.minutes, 0)
        + length.minutes;

    return { price, minutes, service, addons, length };
}

export function getSlots(state) {
    return buildSlots(state.dayKey, Math.max(getTotals(state).minutes, 30));
}

export function formatMoney(amount) {
    return `৳${amount.toLocaleString('en-US')}`;
}

export function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

export function canLeaveStep(state) {
    if (state.step === 0) return Boolean(state.serviceId);
    if (state.step === 3) return Boolean(state.slot);
    return true;
}

export function validateDetails(details) {
    const errors = {};

    if (details.name.trim().length < 2) {
        errors.name = 'We need a name for the chair.';
    }

    const digits = details.phone.replace(/[^\d]/g, '');
    if (digits.length < 10 || digits.length > 15) {
        errors.phone = 'Enter a reachable number, 10–15 digits.';
    }

    if (details.email.trim() !== '' && !EMAIL_PATTERN.test(details.email.trim())) {
        errors.email = 'That email looks incomplete.';
    }

    return errors;
}
