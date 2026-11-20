/* Static catalogue for the NAIL BAR booking flow. */

export const SERVICES = [
    { id: 'petite', name: 'Petite', price: 1200, minutes: 45, blurb: 'Solid colour, short nails' },
    { id: 'standard', name: 'Standard', price: 1800, minutes: 50, blurb: 'Chrome french or jelly', tag: 'Most booked' },
    { id: 'statement', name: 'Statement', price: 2600, minutes: 80, blurb: 'Aura cat-eye + art' },
    { id: 'removal', name: 'Removal only', price: 600, minutes: 30, blurb: 'Hand-file off, no new set' }
];

export const ADDONS = [
    { id: 'chrome', name: 'Chrome powder', price: 300, minutes: 15 },
    { id: 'gems', name: 'Gems', price: 250, minutes: 10 },
    { id: 'french', name: 'French tips', price: 200, minutes: 10 },
    { id: 'length', name: 'Extended length', price: 400, minutes: 15 }
];

export const SHAPES = [
    { id: 'square', name: 'Square' },
    { id: 'almond', name: 'Almond' },
    { id: 'coffin', name: 'Coffin' },
    { id: 'oval', name: 'Oval' }
];

export const LENGTHS = [
    { id: 'short', name: 'Short', price: 0, minutes: 0 },
    { id: 'medium', name: 'Medium', price: 200, minutes: 5 },
    { id: 'long', name: 'Long', price: 400, minutes: 10 }
];

export const ARTISTS = [
    { id: 'any', name: 'No preference', initials: 'NB', note: 'First chair free', rating: null },
    { id: 'sadia', name: 'Sadia A.', initials: 'SA', note: 'Chrome, micro french, structure gel', rating: '4.9' },
    { id: 'rina', name: 'Rina N.', initials: 'RN', note: 'Jelly, aura cat-eye, hand-painted art', rating: '4.8' }
];

export const OPEN_MINUTES = 10 * 60;
export const CLOSE_MINUTES = 20 * 60;
export const SLOT_STEP = 30;
export const CLOSED_WEEKDAY = 1; /* Monday */

export const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function buildDays(count = 10) {
    const days = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (days.length < count) {
        cursor.setDate(cursor.getDate() + 1);
        if (cursor.getDay() === CLOSED_WEEKDAY) continue;
        days.push({
            key: cursor.toISOString().slice(0, 10),
            weekday: DAY_LABELS[cursor.getDay()],
            dayNumber: cursor.getDate(),
            month: cursor.toLocaleString('en-GB', { month: 'short' }),
            label: cursor.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
        });
    }

    return days;
}

/* Deterministic "booked out" slots so the grid looks like a real schedule. */
export function buildSlots(dayKey, minutesNeeded) {
    const seed = Number(dayKey.replaceAll('-', '').slice(-4));
    const slots = [];

    for (let minute = OPEN_MINUTES; minute + minutesNeeded <= CLOSE_MINUTES; minute += SLOT_STEP) {
        const index = (minute - OPEN_MINUTES) / SLOT_STEP;
        const busy = (seed + index * 7) % 5 === 0 || (seed + index * 3) % 11 === 0;

        slots.push({
            value: `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`,
            minutes: minute,
            available: !busy
        });
    }

    return slots;
}
