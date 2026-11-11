interface Step {
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    title: 'Match',
    description: 'Paste a job description to rank resumes and see matched and missing skills.',
  },
  {
    title: 'Select',
    description: 'Pick a candidate from the ranked list to focus the questions on them.',
  },
  {
    title: 'Generate',
    description: 'Get interview questions tailored to that candidate, graded by difficulty.',
  },
];

export function InterviewBanner() {
  return (
    <section
      aria-labelledby="interview-banner-title"
      className="rounded-xl border border-brand-line bg-gradient-to-br from-brand-primary-soft to-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary text-xl text-white">
          🧠
        </div>
        <div>
          <h3 id="interview-banner-title" className="text-base font-semibold text-brand-primary">
            Interview question generator
          </h3>
          <p className="text-xs text-brand-muted">
            Questions are built from the job description and the candidate's resume, so each
            interview is relevant to the role and the person.
          </p>
        </div>
      </div>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-brand-line bg-white p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
              Step {index + 1}
            </span>
            <h4 className="text-sm font-semibold text-brand-primary">{step.title}</h4>
            <p className="mt-1 text-xs text-brand-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
