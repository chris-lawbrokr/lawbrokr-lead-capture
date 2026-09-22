import { CONFIG } from '../../config';

export function BookingPanel() {
  return (
    <div className="mb-5 overflow-hidden rounded-card border border-line bg-panel animate-rise">
      <div className="border-b border-line px-[18px] py-4">
        <strong className="block text-base font-bold">Pick a time that works</strong>
        <span className="text-[0.85rem] text-muted">20-minute call with our team</span>
      </div>
      <iframe
        className="block h-[560px] w-full border-0"
        src={CONFIG.hubspotMeetingLink}
        title="Book a discovery call"
      />
      <div className="px-[18px] pt-[10px] pb-4 text-[0.85rem]">
        Calendar not loading?{' '}
        <a
          className="border-b border-clay-600 pb-px font-bold text-clay-600 no-underline hover:text-clay-500 hover:border-clay-500"
          href={CONFIG.hubspotMeetingLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open it in a new tab
        </a>
        .
      </div>
    </div>
  );
}
