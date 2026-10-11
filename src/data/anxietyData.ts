// Teaching anxiety scale, 18 items on a 5-point frequency scale.
// Answered twice: the "before" items in the survey shown before the game starts,
// the "after" items in the final evaluation.

export const ANXIETY_SCALE_MAX = 5;
export const ANXIETY_SCALE_LABELS = ['Never', 'Infrequently', 'Occasionally', 'Frequently', 'Always'];

export const ANXIETY_ITEMS = [
    { id: 1, text: 'I feel uncertain about my ability to improvise in the classroom.' },
    { id: 2, text: 'Even if I have trouble answering a student\'s question, I would find it easy to concentrate on questions that follow.' },
    { id: 3, text: 'I feel anxious when preparing lessons.' },
    { id: 4, text: 'I\'m afraid students won\'t follow my instructions.' },
    { id: 5, text: 'I\'m afraid other tutors will think I\'m incompetent.' },
    { id: 6, text: 'I feel anxious about my ability to keep a class under control.' },
    { id: 7, text: 'I feel I will be less competent in the classroom than other tutors.' },
    { id: 8, text: 'I feel certain about my ability to keep the class interested in what I will teach them.' },
    { id: 9, text: 'I find it difficult to admit that I don\'t know the answer to a question a student asks.' },
    { id: 10, text: 'I feel that I am as good as other tutors.' },
    { id: 11, text: 'I feel at ease when I am being observed by a superior.' },
    { id: 12, text: 'I\'m afraid I will forget everything I know when I get in front of a class.' },
    { id: 13, text: 'I feel comfortable when I speak before a group.' },
    { id: 14, text: 'I would feel calm and collected even when a student asks me a question I couldn\'t answer.' },
    { id: 15, text: 'I feel less well prepared for teaching than other tutors.' },
    { id: 16, text: 'I am able to decide how to present information in the classroom without a feeling of uncertainty.' },
    { id: 17, text: 'I feel sure I can be a good tutor.' },
    { id: 18, text: 'Good rapport with my students will be one of my strong points.' },
] as const;

export type AnxietyItemId = typeof ANXIETY_ITEMS[number]['id'];
export type AnxietyPhase = 'before' | 'after';
export type AnxietyField = `anx_${AnxietyItemId}_${AnxietyPhase}`;

// One answer (1–5, or null if unanswered) per item and phase
export type AnxietyAnswers = Record<AnxietyField, number | null>;

export const anxietyField = <P extends AnxietyPhase>(id: AnxietyItemId, phase: P): `anx_${AnxietyItemId}_${P}` =>
    `anx_${id}_${phase}`;

export type AnxietyBeforeField = AnxietyField & `${string}_before`;
export type AnxietyAfterField = AnxietyField & `${string}_after`;

// Answers collected before playing, kept in the game store until the evaluation is uploaded
export type AnxietyBeforeAnswers = Record<AnxietyBeforeField, number | null>;

export const ANXIETY_BEFORE_FIELDS: AnxietyBeforeField[] = ANXIETY_ITEMS.map((item) => anxietyField(item.id, 'before'));
export const ANXIETY_AFTER_FIELDS: AnxietyAfterField[] = ANXIETY_ITEMS.map((item) => anxietyField(item.id, 'after'));

export const ANXIETY_FIELDS: AnxietyField[] = [...ANXIETY_BEFORE_FIELDS, ...ANXIETY_AFTER_FIELDS];

export const emptyAnxietyAnswers = (): AnxietyAnswers =>
    Object.fromEntries(ANXIETY_FIELDS.map((f) => [f, null])) as AnxietyAnswers;

export const emptyAnxietyBeforeAnswers = (): AnxietyBeforeAnswers =>
    Object.fromEntries(ANXIETY_BEFORE_FIELDS.map((f) => [f, null])) as AnxietyBeforeAnswers;
