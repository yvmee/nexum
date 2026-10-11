import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useSoundStore, withClickSound } from '../store/useSoundStore';
import { AnxietyBlock, NgseBlock, SectionHeader, SurveyShell } from '../components/SurveyParts';
import { NGSE_BEFORE_FIELDS, emptyNgseBeforeAnswers } from '../data/ngseData';
import { ANXIETY_BEFORE_FIELDS, emptyAnxietyBeforeAnswers } from '../data/anxietyData';
import type { NgseField } from '../data/ngseData';
import type { AnxietyField } from '../data/anxietyData';
import type { PreSurveyAnswers } from '../store/useGameStore';

/**
 * Survey shown after the consent form and before the game starts.
 * The answers are kept in the game store and uploaded together with the final evaluation.
 */
export const PreSurvey: React.FC = () => {
    const navigate = useNavigate();
    const stopBgm = useSoundStore((s) => s.stopBgm);
    // Checked once on arrival: submitting resets the consent flag, which must not trigger the redirect
    const [hasConsent] = useState(() => useGameStore.getState().consentGiven);
    const [answers, setAnswers] = useState<PreSurveyAnswers>(() => ({
        ...emptyAnxietyBeforeAnswers(),
        ...emptyNgseBeforeAnswers(),
    }));

    useEffect(() => {
        stopBgm();
    }, [stopBgm]);

    // The game can only be reached through the consent form
    useEffect(() => {
        if (!hasConsent) void navigate('/');
    }, [hasConsent, navigate]);

    const setLikert = (key: NgseField | AnxietyField, value: number) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));
    };

    const canStart = [...ANXIETY_BEFORE_FIELDS, ...NGSE_BEFORE_FIELDS].every((f) => answers[f] !== null);

    const handleStart = (): void => {
        if (!canStart) return;
        const { submitPreSurvey, startGame } = useGameStore.getState();
        submitPreSurvey(answers);
        startGame();
        void navigate('/game');
    };

    if (!hasConsent) return null;

    return (
        <SurveyShell>
            <h1 className="text-foreground font-black text-4xl mb-2 tracking-[0.2em] text-center">
                Before You Start
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
                Please fill out the following short survey before playing the game. Your answers are anonymous and will be used for research purposes only.
                All fields marked <span className="text-primary">*</span> are required.
            </p>

            {/* Teaching anxiety */}
            <SectionHeader
                title="Before playing the game"
                description="Think about how you feel right now when thinking about being a Tutor, and rate how often the following statements apply to you on a scale from 1 to 5. (1 = never, 2 = infrequently, 3 = occasionally, 4 = frequently, 5 = always)."
            />

            <AnxietyBlock phase="before" values={answers} onChange={setLikert} />

            {/* Self-efficacy */}
            <SectionHeader
                title="Before playing the game (continued)"
                description="Think about how you feel right now about being a Tutor, and rate the following statements on a scale from 1 to 5 in regards of your upcoming teaching task. (1 = strongly disagree, 2 = disagree, 3 = neutral, 4 = agree, 5 = strongly agree)."
            />

            <NgseBlock phase="before" values={answers} onChange={setLikert} />

            {!canStart && (
                <p className="text-muted-foreground text-xs text-center mb-3">
                    Please answer all required questions before starting the game.
                </p>
            )}

            <div className="flex justify-center mb-16">
                <button
                    onClick={withClickSound(handleStart)}
                    disabled={!canStart}
                    className={`
                    rounded-full border
                    text-xl font-bold uppercase tracking-widest
                    py-4 px-12 cursor-pointer
                    transition-all duration-300 ease-out
                    ${canStart
                            ? 'bg-primary border-primary text-primary-foreground hover:opacity-90 hover:scale-105 hover:shadow-md'
                            : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                        }
                `}
                >
                    Start Game
                </button>
            </div>
        </SurveyShell>
    );
};
