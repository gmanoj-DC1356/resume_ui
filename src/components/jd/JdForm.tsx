import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Field, FieldError, TextArea, TextInput } from '@/components/common/TextInput';
import { JdGuide } from '@/components/jd/JdGuide';
import { SkillTagInput } from '@/components/jd/SkillTagInput';
import { SUGGESTED_SKILLS } from '@/components/jd/suggestedSkills';
import {
  JD_TEXT_MAX_LENGTH,
  JD_TITLE_MAX_LENGTH,
  MAX_SKILLS,
  mergeSkills,
  validateJd,
  type JdErrors,
} from '@/components/jd/validateJd';
import { useAppDispatch } from '@/store/hooks';
import { clearJd, submitJd } from '@/store/slices/jdSlice';
import { useId, useState, type FormEvent } from 'react';

interface JdFormProps {
  onSubmitted: () => void;
}

export function JdForm({ onSubmitted }: Readonly<JdFormProps>) {
  const dispatch = useAppDispatch();
  // Always start blank: the form is not pre-filled from an earlier search when the tab is reopened.
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<JdErrors>({});

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const textId = `${baseId}-text`;
  const skillsId = `${baseId}-skills`;

  const unusedSuggestions = SUGGESTED_SKILLS.filter(
    (suggestion) => !skills.some((skill) => skill.toLowerCase() === suggestion.toLowerCase()),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const snapshot = { title: title.trim(), text: text.trim(), skills };
    const found = validateJd(snapshot);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    dispatch(submitJd(snapshot));
    onSubmitted();
  };

  const handleReset = () => {
    setTitle('');
    setText('');
    setSkills([]);
    setErrors({});
    dispatch(clearJd());
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card
        title="Describe the role"
        description="We rank resumes against this and show matched and missing skills for each candidate."
      >
        <form onSubmit={handleSubmit} noValidate>
          <Field htmlFor={titleId} className="mb-1.5 block text-sm font-medium">
            Job title
          </Field>
          <TextInput
            id={titleId}
            value={title}
            maxLength={JD_TITLE_MAX_LENGTH}
            invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? `${titleId}-error` : undefined}
            placeholder="e.g. Senior Data Engineer"
            onChange={(event) => setTitle(event.target.value)}
          />
          <FieldError id={`${titleId}-error`} message={errors.title} />

          <Field htmlFor={textId}>Job description</Field>
          <TextArea
            id={textId}
            rows={10}
            value={text}
            maxLength={JD_TEXT_MAX_LENGTH}
            invalid={Boolean(errors.text)}
            aria-describedby={errors.text ? `${textId}-error` : undefined}
            placeholder="Responsibilities, requirements, nice-to-haves…"
            onChange={(event) => setText(event.target.value)}
          />
          <div className="mt-1 flex justify-between text-xs text-brand-muted">
            <FieldError id={`${textId}-error`} message={errors.text} />
            <span className="ml-auto">
              {text.length}/{JD_TEXT_MAX_LENGTH}
            </span>
          </div>

          <Field htmlFor={skillsId}>
            Major key skills{' '}
            <span className="font-normal text-brand-muted">
              ({skills.length}/{MAX_SKILLS})
            </span>
          </Field>
          <SkillTagInput
            id={skillsId}
            skills={skills}
            onChange={setSkills}
            invalid={Boolean(errors.skills)}
            describedBy={errors.skills ? `${skillsId}-error` : undefined}
          />
          <FieldError id={`${skillsId}-error`} message={errors.skills} />

          {unusedSuggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-brand-muted">Quick add:</span>
              {unusedSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setSkills(mergeSkills(skills, [suggestion]))}
                  className="rounded-full border border-dashed border-brand-line px-2.5 py-0.5 text-xs text-brand-muted transition-colors hover:border-brand-secondary hover:text-brand-secondary"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-3 border-t border-brand-line pt-5">
            <Button type="submit">Find matches</Button>
            <Button variant="ghost" onClick={handleReset}>
              Clear
            </Button>
          </div>
        </form>
      </Card>
      <JdGuide title={title} text={text} skills={skills} />
    </div>
  );
}
