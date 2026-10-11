import React from 'react';
import SchoolBackground from '../../assets/backgrounds/BackgroundLecturehall.png';
import {
    NGSE_ITEMS, NGSE_SCALE_MAX, ngseField,
    type NgseAnswers, type NgseField, type NgsePhase,
} from '../data/ngseData';
import {
    ANXIETY_ITEMS, ANXIETY_SCALE_LABELS, ANXIETY_SCALE_MAX, anxietyField,
    type AnxietyAnswers, type AnxietyField, type AnxietyPhase,
} from '../data/anxietyData';

// Building blocks shared by the pre-game survey and the final evaluation

/**
 * Full-screen survey layout: lecture hall background with a scrollable card in the center
 */
export const SurveyShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full h-full">
        {/* Background */}
        <div className="absolute inset-0 z-0">
            <img src={SchoolBackground} alt="Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/85" />
        </div>

        {/* Scrollable content */}
        <div className="relative z-10 w-full h-full overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-12 bg-background shadow-xl rounded-none sm:rounded-2xl my-0 sm:my-8 min-h-full sm:min-h-0">
                {children}
            </div>
        </div>
    </div>
);

export const SectionHeader: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
    <div className="mt-8 mb-5 border-b border-border pb-2">
        <h2 className="text-primary font-black text-xl tracking-widest uppercase">
            {title}
        </h2>
        {description && (
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
    </div>
);

interface LikertRowProps<K extends string> {
    label: string;
    name: K;
    value: number | null;
    onChange: (key: K, v: number) => void;
    scaleMax?: number;
    // Optional label per button (index 0 = value 1); defaults to agree/disagree on the end points
    labels?: string[];
}

export function LikertRow<K extends string>({ label, name, value, onChange, scaleMax = 6, labels }: LikertRowProps<K>) {
    return (
        <div className="mb-5">
            <p className="text-foreground text-sm mb-3 leading-snug">{label}<span className="text-primary ml-1">*</span></p>
            <div className="flex gap-2 flex-wrap">
                {Array.from({ length: scaleMax }, (_, i) => i + 1).map((n) => (
                    <label
                        key={n}
                        className={`flex flex-col items-center justify-start gap-1 w-[5.5rem] h-[4.5rem] shrink-0 cursor-pointer px-2 py-2 rounded-lg border transition-all
                ${value === n
                                ? 'border-primary bg-secondary text-secondary-foreground'
                                : 'border-border bg-background text-muted-foreground hover:border-ring hover:bg-accent'
                            }`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={n}
                            checked={value === n}
                            onChange={() => onChange(name, n)}
                            className="sr-only"
                        />
                        <span className="font-bold text-sm">{n}</span>
                        {labels ? (
                            <span className="text-xs text-center leading-tight">{labels[n - 1]}</span>
                        ) : (n === 1 || n === scaleMax) && (
                            <span className="text-xs text-center leading-tight whitespace-pre-line">
                                {n === 1 ? 'Strongly\ndisagree' : 'Strongly\nagree'}
                            </span>
                        )}
                    </label>
                ))}
            </div>
        </div>
    );
}

interface LikertBlockProps<K extends string> {
    items: { key: K; text: string }[];
    values: Partial<Record<K, number | null>>;
    onChange: (key: K, v: number) => void;
    scaleMax?: number;
    labels?: string[];
}

// One boxed LikertRow per item
function LikertBlock<K extends string>({ items, values, onChange, scaleMax, labels }: LikertBlockProps<K>) {
    return (
        <>
            {items.map((item) => (
                <div key={item.key} className="mb-6 p-4 rounded-xl bg-muted border border-border">
                    <LikertRow
                        label={item.text}
                        name={item.key}
                        value={values[item.key] ?? null}
                        onChange={onChange}
                        scaleMax={scaleMax}
                        labels={labels}
                    />
                </div>
            ))}
        </>
    );
}

interface NgseBlockProps {
    phase: NgsePhase;
    values: Partial<NgseAnswers>;
    onChange: (key: NgseField, v: number) => void;
}

/**
 * The 8 New General Self-Efficacy Scale items for one phase (before / after playing)
 */
export const NgseBlock: React.FC<NgseBlockProps> = ({ phase, values, onChange }) => (
    <LikertBlock
        items={NGSE_ITEMS.map((item) => ({ key: ngseField(item.id, phase), text: item.text }))}
        values={values}
        onChange={onChange}
        scaleMax={NGSE_SCALE_MAX}
    />
);

interface AnxietyBlockProps {
    phase: AnxietyPhase;
    values: Partial<AnxietyAnswers>;
    onChange: (key: AnxietyField, v: number) => void;
}

/**
 * The 18 teaching anxiety items for one phase (before / after playing)
 */
export const AnxietyBlock: React.FC<AnxietyBlockProps> = ({ phase, values, onChange }) => (
    <LikertBlock
        items={ANXIETY_ITEMS.map((item) => ({ key: anxietyField(item.id, phase), text: item.text }))}
        values={values}
        onChange={onChange}
        scaleMax={ANXIETY_SCALE_MAX}
        labels={ANXIETY_SCALE_LABELS}
    />
);
