import { MAX_SKILLS, mergeSkills, SKILL_MAX_LENGTH } from '@/components/jd/validateJd';
import { useState, type KeyboardEvent } from 'react';

interface SkillTagInputProps {
  id: string;
  skills: string[];
  onChange: (skills: string[]) => void;
  invalid?: boolean;
  describedBy?: string;
}

// Chip-style input: Enter, comma or blur adds a skill; Backspace on an empty draft removes the last one.
export function SkillTagInput({
  id,
  skills,
  onChange,
  invalid,
  describedBy,
}: Readonly<SkillTagInputProps>) {
  const [draft, setDraft] = useState('');
  const atLimit = skills.length >= MAX_SKILLS;

  const addSkills = (candidates: string[]) => {
    const next = mergeSkills(skills, candidates);
    if (next.length !== skills.length) onChange(next);
  };

  const handleChange = (value: string) => {
    const parts = value.split(',');
    if (parts.length === 1) {
      setDraft(value);
      return;
    }
    addSkills(parts.slice(0, -1));
    setDraft(parts.at(-1) ?? '');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkills([draft]);
      setDraft('');
    } else if (event.key === 'Backspace' && draft === '' && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  const handleBlur = () => {
    addSkills([draft]);
    setDraft('');
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 rounded-lg border bg-white p-2 shadow-sm focus-within:outline-2 focus-within:outline-brand-accent ${
        invalid ? 'border-brand-bad' : 'border-brand-line'
      }`}
    >
      <ul className="contents">
        {skills.map((skill) => (
          <li
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-brand-primary-soft py-0.5 pr-1 pl-3 text-xs font-medium text-brand-primary"
          >
            {skill}
            <button
              type="button"
              aria-label={`Remove ${skill}`}
              onClick={() => onChange(skills.filter((existing) => existing !== skill))}
              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-brand-primary hover:text-white"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <input
        id={id}
        value={draft}
        disabled={atLimit}
        maxLength={SKILL_MAX_LENGTH}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        placeholder={atLimit ? 'Skill limit reached' : 'Type a skill and press Enter'}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="min-w-40 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
