import { PILLARS, PROOF } from '../data/brand';

/**
 * Left-hand brand column: the pitch that frames the conversation.
 *
 * No rules or dividers — the sections are separated by spacing alone, so the
 * vertical rhythm carries the structure that the borders used to.
 */
export function BrandPanel() {
  return (
    <aside className="flex flex-col justify-between bg-brand-900 px-7 py-10 text-white lg:px-14 lg:py-16">
      <div>
        <h1 className="max-w-[11ch] font-display text-[2.5rem] leading-[1.15] font-semibold">
          Speak with an AI Expert.
        </h1>
        <p className="mt-[18px] max-w-[38ch] text-[1.05rem]">
          Tell us a bit about your firm. We'll ask a few quick questions, then get you on the
          calendar with our team.
        </p>

        <dl className="mt-11 space-y-5">
          {PILLARS.map((pillar) => (
            <div key={pillar.name} className="flex flex-col gap-1 sm:flex-row sm:gap-[14px]">
              <dt className="text-[0.95rem] sm:w-[15ch] sm:shrink-0">{pillar.name}</dt>
              <dd className="text-[0.9rem]">{pillar.description}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-11">
          <div className="font-display text-[2.1rem] leading-none font-bold">{PROOF.stat}</div>
          <p className="mt-2 max-w-[30ch] text-[0.88rem]">{PROOF.copy}</p>
        </div>
      </div>

      <p className="mt-10 text-[0.85rem]">Lawbrokr &mdash; Conversion Intelligence for Law</p>
    </aside>
  );
}
