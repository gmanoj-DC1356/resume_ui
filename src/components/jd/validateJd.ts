import type { JdSnapshot } from '@/types/domain';

export const JD_TITLE_MAX_LENGTH = 120;
export const JD_TEXT_MIN_LENGTH = 50;
export const JD_TEXT_MAX_LENGTH = 5000;
export const MAX_SKILLS = 15;
export const SKILL_MAX_LENGTH = 40;

// Allowlist: letters, digits and the punctuation seen in skill names (C++, C#, .NET, CI/CD, R&D).
const SKILL_PATTERN = /^[\p{L}\p{N}.][\p{L}\p{N} .+#/&-]*$/u;

export type JdField = 'title' | 'text' | 'skills';
export type JdErrors = Partial<Record<JdField, string>>;

// Appends new skills, skipping blanks and case-insensitive duplicates, up to MAX_SKILLS.
export function mergeSkills(existing: string[], candidates: string[]): string[] {
  const merged = [...existing];
  for (const raw of candidates) {
    const skill = raw.trim();
    const duplicate = merged.some((item) => item.toLowerCase() === skill.toLowerCase());
    if (skill && !duplicate && merged.length < MAX_SKILLS) merged.push(skill);
  }
  return merged;
}

function validateSkills(skills: string[]): string | undefined {
  if (skills.length === 0) return 'Add at least one key skill.';
  if (skills.length > MAX_SKILLS) return `Add at most ${MAX_SKILLS} skills.`;
  const malformed = skills.some(
    (skill) => skill.length > SKILL_MAX_LENGTH || !SKILL_PATTERN.test(skill),
  );
  return malformed
    ? 'Skills may only contain letters, numbers, spaces and . + # / & -'
    : undefined;
}

export function validateJd({ title, text, skills }: JdSnapshot): JdErrors {
  const errors: JdErrors = {};
  if (title.length === 0) errors.title = 'Enter a job title.';
  else if (title.length > JD_TITLE_MAX_LENGTH) {
    errors.title = `Keep the title under ${JD_TITLE_MAX_LENGTH} characters.`;
  }

  if (text.length < JD_TEXT_MIN_LENGTH) {
    errors.text = `Describe the role in at least ${JD_TEXT_MIN_LENGTH} characters.`;
  } else if (text.length > JD_TEXT_MAX_LENGTH) {
    errors.text = `Keep the description under ${JD_TEXT_MAX_LENGTH} characters.`;
  }

  const skillsError = validateSkills(skills);
  if (skillsError) errors.skills = skillsError;
  return errors;
}
