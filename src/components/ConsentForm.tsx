import React, { useState } from 'react';
import { withClickSound } from '../store/useSoundStore';

interface ConsentFormProps {
    onConsent: () => void;
    onCancel: () => void;
}

export const ConsentForm: React.FC<ConsentFormProps> = ({ onConsent, onCancel }) => {
    const [checked, setChecked] = useState({ c1: false, c2: false, c3: false });

    const allChecked = checked.c1 && checked.c2 && checked.c3;

    const toggle = (key: keyof typeof checked) =>
        setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-2xl p-8 flex flex-col gap-6">

                {/* Title */}
                <h2 className="text-2xl font-bold tracking-wide text-center">
                    Informed Consent
                </h2>

                {/* Section: Study Description */}
                <section className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white/90 border-b border-white/20 pb-1">
                        About the Study
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                        This study involves playing a game demo for Nexum, a visual novel web game designed as an onboarding experience 
                        for student tutors and doctoral candidates, and completing a short survey about your experience. 
                        The goal is to evaluate the game's effectiveness and usability. 
                        This study is conducted as part of a master thesis at TUM.
                    </p>
                </section>

                {/* Section: Task Description */}
                <section className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white/90 border-b border-white/20 pb-1">
                        Your Task
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                        You will play through the Nexum game demo, by reading through the story, clicking decisions, 
                        and responding to text prompts. 
                        After the game ends, you will be taken to an anonymous survey about your experience. 
                        Please use a <strong>notebook or desktop computer</strong> as the game is not optimised for mobile devices.
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                        The game demo should take around 20 minutes to complete, and the survey will take an additional 5-10 minutes. 
                        Completing the study should take approximately <strong>25–30 minutes</strong> in total.
                    </p>
                </section>

                {/* Section: Data & Privacy */}
                <section className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white/90 border-b border-white/20 pb-1">
                        Data & Privacy
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                        The survey is fully anonymous. Your responses will be used solely for the 
                        academic evaluation of the Nexum prototype and will not be shared with third parties. 
                        Survey data is accessible only to the researcher.
                        Your participation is entirely voluntary. 
                        You may withdraw from the study at any time without consequence. 
                        No data from incomplete sessions will be retained.
                    </p>
                </section>

                {/* Checkboxes */}
                <section className="flex flex-col gap-3 pt-2">
                    <h3 className="text-lg font-semibold text-white/90 border-b border-white/20 pb-1">
                        Please confirm 
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                        By checking all boxes below and clicking "Begin study", you confirm that you have read and understood the information above and agree to participate on these terms.
                    </p>

                    {[
                        {
                            key: 'c1' as const,
                            label:
                                'I understand the purpose of this study and what my participation involves. I understand that my responses are anonymous and will be used only for academic evaluation of the Nexum demo.',
                        },
                        {
                            key: 'c2' as const,
                            label:
                                'I understand that my participation is voluntary and that I may withdraw at any time without consequence.',
                        },
                        {
                            key: 'c3' as const,
                            label:
                                'I confirm that I am 18 years of age or older.',
                        },
                    ].map(({ key, label }) => (
                        <label
                            key={key}
                            className="flex items-start gap-3 cursor-pointer group"
                            onClick={() => toggle(key)}
                        >
                            <div
                                className={`
                                    mt-0.5 w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center
                                    transition-all duration-200
                                    ${checked[key]
                                        ? 'bg-white border-white'
                                        : 'bg-white/10 border-white/40 group-hover:border-white/70'}
                                `}
                            >
                                {checked[key] && (
                                    <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
                                        <path
                                            d="M2 6l3 3 5-5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-white/85 leading-snug select-none">
                                {label}
                            </span>
                        </label>
                    ))}
                </section>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-2">
                    <button
                        className="
                            rounded-full border border-white/30 bg-white/5
                            text-white/70 text-sm font-semibold uppercase tracking-widest
                            py-2 px-6 cursor-pointer
                            transition-all duration-200
                            hover:bg-white/10 hover:border-white/50 hover:text-white
                        "
                        onClick={withClickSound(onCancel)}
                    >
                        Back
                    </button>
                    <button
                        className={`
                            rounded-full border text-sm font-bold uppercase tracking-widest
                            py-2 px-6 transition-all duration-300
                            ${allChecked
                                ? 'bg-white/20 border-white/50 text-white cursor-pointer hover:bg-white/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                : 'bg-white/5 border-white/15 text-white/30 cursor-not-allowed'}
                        `}
                        onClick={allChecked ? withClickSound(onConsent) : undefined}
                        disabled={!allChecked}
                    >
                        Begin Study
                    </button>
                </div>
            </div>
        </div>
    );
};
