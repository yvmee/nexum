import React, { useEffect, useState } from 'react';
import SchoolBackground from '../../assets/backgrounds/BackgroundLecturehall.png';
import { useSoundStore } from '../store/useSoundStore';
import { uploadEvaluation } from '../db/database';

const background = SchoolBackground;

// Types for evaluation items

export interface EvaluationData {
  // Demographics
  age: string;
  gender: string;
  study: string;
  gamingExperience: string;
  tutorialVisited: string;
  tutorialHeld: string;
  exerciseHeld: string;
  // Likert pre/post TCHAS pairs (1–6)
  uncomfortable_before: number | null;
  uncomfortable_after: number | null;
  worried_tutor_before: number | null;
  worried_tutor_after: number | null;
  better_prepared_before: number | null;
  better_prepared_after: number | null;
  rapport_worry_before: number | null;
  rapport_worry_after: number | null;
  keep_interested_before: number | null;
  keep_interested_after: number | null;
  present_info_before: number | null;
  present_info_after: number | null;
  // Likert perceived usability items
  scenarios_better_sense: number | null;
  scenarios_too_different: number | null;
  reflection_helped: number | null;
  reflection_difficult_connect: number | null;
  others_perspectives: number | null;
  own_contribution_meaningful: number | null;
  more_confident: number | null;
  no_change: number | null;
  // Open questions
  most_relevant: string;
  missing: string;
  most_essential: string;
  other_comments: string;
}

const EMPTY: EvaluationData = {
  age: '', gender: '', study: '', gamingExperience: '',
  tutorialVisited: '', tutorialHeld: '', exerciseHeld: '',
  uncomfortable_before: null, uncomfortable_after: null,
  worried_tutor_before: null, worried_tutor_after: null,
  better_prepared_before: null, better_prepared_after: null,
  rapport_worry_before: null, rapport_worry_after: null,
  keep_interested_before: null, keep_interested_after: null,
  present_info_before: null, present_info_after: null,
  scenarios_better_sense: null, scenarios_too_different: null,
  reflection_helped: null, reflection_difficult_connect: null,
  others_perspectives: null, own_contribution_meaningful: null,
  more_confident: null, no_change: null,
  most_relevant: '', missing: '', most_essential: '', other_comments: '',
};

// Helper function to check if all required fields are filled out before allowing submission
function isComplete(d: EvaluationData): boolean {
  const requiredStrings: (keyof EvaluationData)[] = [
    'age', 'gender', 'study', 'gamingExperience',
    'tutorialVisited', 'tutorialHeld', 'exerciseHeld',
    'most_relevant', 'missing', 'most_essential',
  ];
  if (requiredStrings.some((k) => !(d[k] as string).trim())) return false;

  const requiredLikert: (keyof EvaluationData)[] = [
    'uncomfortable_before', 'uncomfortable_after',
    'worried_tutor_before', 'worried_tutor_after',
    'better_prepared_before', 'better_prepared_after',
    'rapport_worry_before', 'rapport_worry_after',
    'keep_interested_before', 'keep_interested_after',
    'present_info_before', 'present_info_after',
    'scenarios_better_sense', 'scenarios_too_different',
    'reflection_helped', 'reflection_difficult_connect',
    'others_perspectives', 'own_contribution_meaningful',
    'more_confident', 'no_change',
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
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value, onChange }) => (
  <div className="mb-6">
    <p className="text-white/90 font-semibold mb-2">{label}</p>
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-amber-400 w-4 h-4 cursor-pointer"
          />
          <span className="text-white/80 group-hover:text-white transition-colors text-sm">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

interface LikertRowProps {
  label: string;
  name: keyof EvaluationData;
  value: number | null;
  onChange: (key: keyof EvaluationData, v: number) => void;
}

const LikertRow: React.FC<LikertRowProps> = ({ label, name, value, onChange }) => (
  <div className="mb-5">
    <p className="text-white/90 text-sm mb-3 leading-snug">{label}</p>
    <div className="flex gap-2 flex-wrap">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <label
          key={n}
          className={`flex flex-col items-center gap-1 cursor-pointer px-3 py-2 rounded-lg border transition-all
            ${value === n
              ? 'border-amber-400 bg-amber-400/20 text-amber-300'
              : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:bg-white/10'
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
          {(n === 1 || n === 6) && (
            <span className="text-xs text-center leading-tight whitespace-pre-line">
              {n === 1 ? 'Strongly\ndisagree' : 'Strongly\nagree'}
            </span>
          )}
        </label>
      ))}
    </div>
  </div>
);

interface LikertPairProps {
  beforeLabel: string;
  afterLabel: string;
  beforeKey: keyof EvaluationData;
  afterKey: keyof EvaluationData;
  beforeValue: number | null;
  afterValue: number | null;
  onChange: (key: keyof EvaluationData, v: number) => void;
}

const LikertPair: React.FC<LikertPairProps> = ({
  beforeLabel, afterLabel, beforeKey, afterKey,
  beforeValue, afterValue, onChange,
}) => (
  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
    <LikertRow label={beforeLabel} name={beforeKey} value={beforeValue} onChange={onChange} />
    <LikertRow label={afterLabel} name={afterKey} value={afterValue} onChange={onChange} />
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
    <label className="block text-white/90 font-semibold mb-2">
      {label}{required && <span className="text-amber-400 ml-1">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      rows={3}
      className="w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30
        px-3 py-2 text-sm resize-y focus:outline-none focus:border-amber-400/60 transition-colors"
      placeholder="Your answer…"
    />
  </div>
);


const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-amber-400 font-black text-xl tracking-widest uppercase mt-8 mb-5 border-b border-white/10 pb-2">
    {title}
  </h2>
);


/**
 * Evaluation page component where users can fill out a survey after playing the game
 */
export const Evaluation: React.FC = () => {
  const stopBgm = useSoundStore((s) => s.stopBgm);
  const [data, setData] = useState<EvaluationData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    stopBgm();
  }, [stopBgm]);

  const setField = (key: keyof EvaluationData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const setLikert = (key: keyof EvaluationData, value: number) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const setRadio = (key: keyof EvaluationData) => (value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = isComplete(data);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await uploadEvaluation(data);
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
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-8">
          <h1 className="text-white font-black text-4xl mb-4 tracking-[0.15em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            Thank you!
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Your responses have been saved. We appreciate your participation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={background} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/85" />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 w-full h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Title */}
          <h1 className="text-white font-black text-4xl mb-2 tracking-[0.2em] text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            Evaluation
          </h1>
          <p className="text-white/50 text-sm text-center mb-8">
            All fields marked <span className="text-amber-400">*</span> are required.
          </p>

          {/* Demographics */}
          <SectionHeader title="Demographics" />

          <div className="mb-6">
            <label className="block text-white/90 font-semibold mb-2">
              Your age <span className="text-amber-400">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={data.age}
              onChange={(e) => setField('age', e.target.value)}
              className="w-32 rounded-lg bg-white/10 border border-white/20 text-white px-3 py-2 text-sm
                focus:outline-none focus:border-amber-400/60 transition-colors"
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

          <div className="mb-6">
            <label className="block text-white/90 font-semibold mb-2">
              What do you study? <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={data.study}
              onChange={(e) => setField('study', e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 text-white px-3 py-2 text-sm
                focus:outline-none focus:border-amber-400/60 transition-colors"
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
              { value: 'multiple', label: 'Yes, multiple (3+)' },
            ]}
          />

          <RadioGroup
            label="Have you ever held a university tutorial? (one means one tutorial spanning over a semester, not one session) *"
            name="tutorialHeld"
            value={data.tutorialHeld}
            onChange={setRadio('tutorialHeld')}
            options={[
              { value: 'never', label: 'No, never' },
              { value: 'one', label: 'Yes, at least one' },
              { value: 'multiple', label: 'Yes, multiple (3+)' },
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
              { value: 'multiple', label: 'Yes, multiple (3+)' },
            ]}
          />

          {/* Likert scale */}
          <SectionHeader title="Rate your agreement (1 = strongly disagree, 6 = strongly agree)" />

          <LikertPair
            beforeLabel="Before playing the game, I felt uncomfortable speaking before a group of students."
            afterLabel="Now, after playing the game, I feel uncomfortable speaking before a group of students."
            beforeKey="uncomfortable_before"
            afterKey="uncomfortable_after"
            beforeValue={data.uncomfortable_before}
            afterValue={data.uncomfortable_after}
            onChange={setLikert}
          />

          <LikertPair
            beforeLabel="Before playing the game, I was worried about whether I could be a good tutor / teaching assistant."
            afterLabel="Now, after playing the game, I am worried about whether I can be a good tutor / teaching assistant."
            beforeKey="worried_tutor_before"
            afterKey="worried_tutor_after"
            beforeValue={data.worried_tutor_before}
            afterValue={data.worried_tutor_after}
            onChange={setLikert}
          />

          <LikertPair
            beforeLabel="Before playing the game, I felt better prepared for teaching than (I assume) others do."
            afterLabel="Now, after playing the game, I feel better prepared for teaching than (I assume) others do."
            beforeKey="better_prepared_before"
            afterKey="better_prepared_after"
            beforeValue={data.better_prepared_before}
            afterValue={data.better_prepared_after}
            onChange={setLikert}
          />

          <LikertPair
            beforeLabel="Before playing the game, a lack of rapport with my students was one of my biggest worries."
            afterLabel="Now, after playing the game, a lack of rapport with my students is one of my biggest worries."
            beforeKey="rapport_worry_before"
            afterKey="rapport_worry_after"
            beforeValue={data.rapport_worry_before}
            afterValue={data.rapport_worry_after}
            onChange={setLikert}
          />

          <LikertPair
            beforeLabel="Before playing the game, I worried about being able to keep students interested in what I teach."
            afterLabel="Now, after playing the game, I worry about being able to keep students interested in what I teach."
            beforeKey="keep_interested_before"
            afterKey="keep_interested_after"
            beforeValue={data.keep_interested_before}
            afterValue={data.keep_interested_after}
            onChange={setLikert}
          />

          <LikertPair
            beforeLabel="Before playing the game, deciding how to present information in a tutorial made me feel uncertain."
            afterLabel="Now, after playing the game, deciding how to present information in a tutorial makes me feel uncertain."
            beforeKey="present_info_before"
            afterKey="present_info_after"
            beforeValue={data.present_info_before}
            afterValue={data.present_info_after}
            onChange={setLikert}
          />

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <LikertRow
              label="Playing through the tutorial scenarios gave me a better sense of what to expect in my first real tutoring session."
              name="scenarios_better_sense"
              value={data.scenarios_better_sense}
              onChange={setLikert}
            />
            <LikertRow
              label="The scenarios in the game feel too different from real tutoring situations to be useful."
              name="scenarios_too_different"
              value={data.scenarios_too_different}
              onChange={setLikert}
            />
          </div>

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <LikertRow
              label="Answering the reflection questions after each tutorial helped me better understand my own decision-making."
              name="reflection_helped"
              value={data.reflection_helped}
              onChange={setLikert}
            />
            <LikertRow
              label="I found it difficult to connect my answers in the reflection questions to my future role as a tutor."
              name="reflection_difficult_connect"
              value={data.reflection_difficult_connect}
              onChange={setLikert}
            />
          </div>

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <LikertRow
              label="Reading other players' solution suggestions gave me new perspectives on how to handle tutoring situations."
              name="others_perspectives"
              value={data.others_perspectives}
              onChange={setLikert}
            />
            <LikertRow
              label="Contributing my own thoughts to the shared discussion felt like a meaningful part of the learning experience."
              name="own_contribution_meaningful"
              value={data.own_contribution_meaningful}
              onChange={setLikert}
            />
          </div>

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <LikertRow
              label="I would feel more confident entering my first tutorial session having played this game than without it."
              name="more_confident"
              value={data.more_confident}
              onChange={setLikert}
            />
            <LikertRow
              label="I do not see how the game experience will change anything about how I approach my tutoring role."
              name="no_change"
              value={data.no_change}
              onChange={setLikert}
            />
          </div>

          {/* Open Questions */}
          <SectionHeader title="Open Questions" />

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
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          {!canSubmit && (
            <p className="text-white/40 text-xs text-center mb-3">
              Please answer all required questions before submitting.
            </p>
          )}

          <div className="flex justify-center mb-16">
            <button
              onClick={() => void handleSubmit()}
              disabled={!canSubmit || submitting}
              className={`
                group relative overflow-hidden rounded-full
                backdrop-blur-md border
                text-xl font-bold uppercase tracking-widest
                py-4 px-12 cursor-pointer
                transition-all duration-300 ease-out
                ${canSubmit && !submitting
                  ? 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/60 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                  : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                }
              `}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


