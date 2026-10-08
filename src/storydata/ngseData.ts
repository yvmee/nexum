// New General Self-Efficacy Scale (NGSE), 8 items.
// Answered twice in the evaluation: once for before and once for after playing the game.

export const NGSE_SCALE_MAX = 5;

export const NGSE_ITEMS = [
    { id: 1, text: 'I will be able to achieve most of the goals that I have set for myself.' },
    { id: 2, text: 'When facing difficult tasks, I am certain that I will accomplish them.' },
    { id: 3, text: 'In general, I think that I can obtain outcomes that are important to me.' },
    { id: 4, text: 'I believe I can succeed at most any endeavor to which I set my mind.' },
    { id: 5, text: 'I will be able to successfully overcome many challenges.' },
    { id: 6, text: 'I am confident that I can perform effectively on many different tasks.' },
    { id: 7, text: 'Compared to other people, I can do most tasks very well.' },
    { id: 8, text: 'Even when things are tough, I can perform quite well.' },
] as const;

export type NgseItemId = typeof NGSE_ITEMS[number]['id'];
export type NgsePhase = 'before' | 'after';
export type NgseField = `ngse_${NgseItemId}_${NgsePhase}`;

// One answer (1–5, or null if unanswered) per item and phase
export type NgseAnswers = Record<NgseField, number | null>;

export const ngseField = (id: NgseItemId, phase: NgsePhase): NgseField => `ngse_${id}_${phase}`;

export const NGSE_FIELDS: NgseField[] = NGSE_ITEMS.flatMap((item) => [
    ngseField(item.id, 'before'),
    ngseField(item.id, 'after'),
]);

export const emptyNgseAnswers = (): NgseAnswers =>
    Object.fromEntries(NGSE_FIELDS.map((f) => [f, null])) as NgseAnswers;
