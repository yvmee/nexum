import React, { useEffect, useState } from 'react';
import SchoolBackground from '../../assets/backgrounds/BackgroundLecturehall.png';
import { AnxietyBlock, NgseBlock, SectionHeader, SurveyShell } from '../components/SurveyParts';
import { useSoundStore, withClickSound } from '../store/useSoundStore';
import { uploadEvaluation } from '../db/database';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { NGSE_AFTER_FIELDS, emptyNgseAnswers, type NgseAnswers } from '../data/ngseData';
import { ANXIETY_AFTER_FIELDS, emptyAnxietyAnswers, type AnxietyAnswers } from '../data/anxietyData';

const background = SchoolBackground;

const TUM_SCHOOLS = [
    'TUM School of Computation, Information & Technology',
    'TUM School of Engineering and Design',
    'TUM School of Life Sciences',
    'TUM School of Management',
    'TUM School of Medicine & Health',
    'TUM School of Natural Sciences',
    'TUM School of Social Sciences & Technology',
];

// Types for evaluation items

export interface EvaluationData extends NgseAnswers, AnxietyAnswers {
    // Demographics
    age: string;
    gender: string;
    studiesAtTum: string;
    tumSchool: string;
    study: string;
    gamingExperience: string;
    tutorialVisited: string;
    tutorialHeld: string;
    exerciseHeld: string;
    // NGSE and teaching anxiety items (1–5) are inherited from NgseAnswers / AnxietyAnswers;
    // the "before" items are filled from the game store on upload
    // Open questions
    most_relevant: string;
    missing: string;
    most_essential: string;
    other_comments: string;
}

const EMPTY: EvaluationData = {
    age: '', gender: '', studiesAtTum: '', tumSchool: '', study: '', gamingExperience: '',
    tutorialVisited: '', tutorialHeld: '', exerciseHeld: '',
    ...emptyAnxietyAnswers(),
    ...emptyNgseAnswers(),
    most_relevant: '', missing: '', most_essential: '', other_comments: '',
};

// Helper function to check if all required fields are filled out before allowing submission
function isComplete(d: EvaluationData): boolean {
    const requiredStrings: (keyof EvaluationData)[] = [
        'age', 'gender', 'studiesAtTum', 'study', 'gamingExperience',
        'tutorialVisited', 'tutorialHeld', 'exerciseHeld',
        'most_relevant', 'missing', 'most_essential',
    ];
    if (requiredStrings.some((k) => !(d[k] as string).trim())) return false;

    // The school is only asked of TUM students
    if (d.studiesAtTum === 'yes' && !d.tumSchool) return false;

    const requiredLikert: (keyof EvaluationData)[] = [
        ...ANXIETY_AFTER_FIELDS,
        ...NGSE_AFTER_FIELDS,
    ];
    if (requiredLikert.some((k) => d[k] === null)) return false;

    return true;
}

// _____ Sub-components ______

interface RadioGroupProps {
    label: string;
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
    // Stack the options instead of wrapping them in a row, for long labels
    vertical?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value, onChange, vertical = false }) => (
    <div className="mb-6">
        <p className="text-foreground font-semibold mb-2">{label}</p>
        <div className={vertical ? 'flex flex-col gap-2' : 'flex flex-wrap gap-3'}>
            {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                        className="accent-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="text-foreground/70 group-hover:text-foreground transition-colors text-sm">
                        {opt.label}
                    </span>
                </label>
            ))}
        </div>
    </div>
);

interface TextAreaQuestionProps {
    label: string;
    name: keyof EvaluationData;
    value: string;
    onChange: (key: keyof EvaluationData, v: string) => void;
    required?: boolean;
}

const TextAreaQuestion: React.FC<TextAreaQuestionProps> = ({ label, name, value, onChange, required = true }) => (
    <div className="mb-6">
        <label className="block text-foreground font-semibold mb-2">
            {label}{required && <span className="text-primary ml-1">*</span>}
        </label>
        <textarea
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            rows={3}
            className="w-full rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground
        px-3 py-2 text-sm resize-y focus:outline-none focus:border-ring transition-colors"
            placeholder="Your answer…"
        />
    </div>
);


/**
 * Evaluation page component where users can fill out a survey after playing the game
 */
export const Evaluation: React.FC = () => {
    const stopBgm = useSoundStore((s) => s.stopBgm);
    const playtime = useGameStore((s) => s.playtime);
    const preSurvey = useGameStore((s) => s.preSurvey);
    const [data, setData] = useState<EvaluationData>(EMPTY);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        stopBgm();
    }, [stopBgm]);

    const handleMenu = (): void => {
        void navigate('/');
    }

    const setField = (key: keyof EvaluationData, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const setLikert = (key: keyof EvaluationData, value: number) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const setRadio = (key: keyof EvaluationData) => (value: string) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
            // Drop a school picked earlier when switching to "no"
            ...(key === 'studiesAtTum' && value !== 'yes' ? { tumSchool: '' } : {}),
        }));
    };

    const canSubmit = isComplete(data);

    const handleSubmit = async () => {
        if (!canSubmit || submitting) return;
        setSubmitting(true);
        setError(null);
        try {
            // The "before" answers come from the survey shown before the game
            await uploadEvaluation({ ...data, ...preSurvey }, playtime);
            useGameStore.getState().clearPreSurvey();
            setSubmitted(true);
        } catch (e) {
            console.error(e);
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="w-full h-full">
                <div className="absolute inset-0 z-0">
                    <img src={background} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/80" />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-8 gap-6">
                    <h1 className="text-white font-black text-4xl mb-4 tracking-[0.15em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                        Thank you!
                    </h1>
                    <p className="text-white/70 text-lg max-w-md">
                        Your responses have been saved and the survey is completed. 
                        We appreciate your participation! You may close this window now.
                    </p>
                    <button
                        onClick={withClickSound(handleMenu)}
                        className="rounded-full backdrop-blur-md bg-white/10 border border-white/30
              text-white text-xl font-bold uppercase tracking-widest
              py-(--menu-btn-py) px-(--menu-btn-px) cursor-pointer
              transition-all duration-300 ease-out
              hover:bg-white/20 hover:border-white/60 hover:scale-105
              hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <SurveyShell>
            {/* Title */}
            <h1 className="text-foreground font-black text-4xl mb-2 tracking-[0.2em] text-center">
                Evaluation
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
                Please fill out the following short survey about your experience. Your answers are anonymous and will be used for research purposes only.
                All fields marked <span className="text-primary">*</span> are required.
            </p>

            {/* Demographics */}
            <SectionHeader
                title="Demographics"
            />

            <div className="mb-6">
                <label className="block text-foreground font-semibold mb-2">
                    Your age <span className="text-primary">*</span>
                </label>
                <input
                    type="number"
                    min={1}
                    max={120}
                    value={data.age}
                    onChange={(e) => setField('age', e.target.value)}
                    className="w-32 rounded-lg bg-background border border-border text-foreground px-3 py-2 text-sm
            focus:outline-none focus:border-ring transition-colors"
                    placeholder="e.g. 25"
                />
            </div>

            <RadioGroup
                label="Your gender *"
                name="gender"
                value={data.gender}
                onChange={setRadio('gender')}
                options={[
                    { value: 'female', label: 'Female' },
                    { value: 'male', label: 'Male' },
                    { value: 'non-binary', label: 'Non-binary' },
                    { value: 'other', label: 'Other' },
                ]}
            />

            <RadioGroup
                label="Do you study at TUM? *"
                name="studiesAtTum"
                value={data.studiesAtTum}
                onChange={setRadio('studiesAtTum')}
                options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ]}
            />

            {data.studiesAtTum === 'yes' && (
                <RadioGroup
                    label="If you study at TUM, select your school *"
                    name="tumSchool"
                    value={data.tumSchool}
                    onChange={setRadio('tumSchool')}
                    vertical
                    options={[
                        ...TUM_SCHOOLS.map((school) => ({ value: school, label: school })),
                        { value: 'other', label: 'Other' },
                    ]}
                />
            )}

            <div className="mb-6">
                <label className="block text-foreground font-semibold mb-2">
                    What do you study? <span className="text-primary">*</span>
                </label>
                <input
                    type="text"
                    value={data.study}
                    onChange={(e) => setField('study', e.target.value)}
                    className="w-full rounded-lg bg-background border border-border text-foreground px-3 py-2 text-sm
            focus:outline-none focus:border-ring transition-colors"
                    placeholder="e.g. Informatics"
                />
            </div>

            <RadioGroup
                label="How much gaming experience do you have? *"
                name="gamingExperience"
                value={data.gamingExperience}
                onChange={setRadio('gamingExperience')}
                options={[
                    { value: 'none', label: 'Almost none' },
                    { value: 'little', label: 'Little' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'regularly', label: 'I play regularly' },
                ]}
            />

            <RadioGroup
                label="Have you visited a tutorial accompanying a lecture before? *"
                name="tutorialVisited"
                value={data.tutorialVisited}
                onChange={setRadio('tutorialVisited')}
                options={[
                    { value: 'never', label: 'No, never' },
                    { value: 'once', label: 'Yes, at least once' },
                    { value: 'multiple', label: 'Yes, for multiple lectures (3+)' },
                ]}
            />

            <RadioGroup
                label="Have you ever held a university tutorial accompanying a lecture? *"
                name="tutorialHeld"
                value={data.tutorialHeld}
                onChange={setRadio('tutorialHeld')}
                options={[
                    { value: 'never', label: 'No, never' },
                    { value: 'one', label: 'Yes, at least one' },
                    { value: 'multiple', label: 'Yes, for multiple lectures (3+)' },
                ]}
            />

            <RadioGroup
                label="Have you ever held an exercise (e.g. a central exercise accompanying a lecture)? *"
                name="exerciseHeld"
                value={data.exerciseHeld}
                onChange={setRadio('exerciseHeld')}
                options={[
                    { value: 'never', label: 'No, never' },
                    { value: 'one', label: 'Yes, at least one' },
                    { value: 'multiple', label: 'Yes, for multiple lectures (3+)' },
                ]}
            />

            {/* Teaching anxiety: after playing */}
            <SectionHeader
                title="After playing the game"
                description="Think about how you feel now about being a Tutor, after playing the game, and rate how often the following statements apply to you on a scale from 1 to 5. (1 = never, 2 = infrequently, 3 = occasionally, 4 = frequently, 5 = always)."
            />

            <AnxietyBlock phase="after" values={data} onChange={setLikert} />

            {/* NGSE: after playing */}
            <SectionHeader
                title="After playing the game (continued)"
                description="Think about how you feel now after playing the game and rate the following statements on a scale from 1 to 5 in regards of your upcoming teaching task. (1 = strongly disagree, 5 = strongly agree)."
            />

            <NgseBlock phase="after" values={data} onChange={setLikert} />

            {/* Open Questions */}
            <SectionHeader
                title="Open Questions"
                description="Please answer the following questions."
            />

            <TextAreaQuestion
                label="Which part of the game felt most relevant for an upcoming role as a tutor and why?"
                name="most_relevant"
                value={data.most_relevant}
                onChange={(k, v) => setField(k, v)}
            />

            <TextAreaQuestion
                label="What was the game missing that you feel is necessary for preparing as a tutor?"
                name="missing"
                value={data.missing}
                onChange={(k, v) => setField(k, v)}
            />

            <TextAreaQuestion
                label="What did you think was the most essential part of the game?"
                name="most_essential"
                value={data.most_essential}
                onChange={(k, v) => setField(k, v)}
            />

            <TextAreaQuestion
                label="Do you have any other comments or suggestions?"
                name="other_comments"
                value={data.other_comments}
                onChange={(k, v) => setField(k, v)}
                required={false}
            />

            {/* Submit */}
            {error && (
                <p className="text-destructive text-sm text-center mb-4">{error}</p>
            )}

            {!canSubmit && (
                <p className="text-muted-foreground text-xs text-center mb-3">
                    Please answer all required questions before submitting.
                </p>
            )}

            <div className="flex justify-center mb-16">
                <button
                    onClick={() => void handleSubmit()}
                    disabled={!canSubmit || submitting}
                    className={`
            rounded-full border
            text-xl font-bold uppercase tracking-widest
            py-4 px-12 cursor-pointer
            transition-all duration-300 ease-out
            ${canSubmit && !submitting
                            ? 'bg-primary border-primary text-primary-foreground hover:opacity-90 hover:scale-105 hover:shadow-md'
                            : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                        }
        `}
                >
                    {submitting ? 'Submitting…' : 'Submit'}
                </button>
            </div>
        </SurveyShell>
    );
};


