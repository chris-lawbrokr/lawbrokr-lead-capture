import { BrandPanel } from "./components/BrandPanel";
import { ChatPanel } from "./components/ChatPanel";
import { useChatFlow } from "./hooks/useChatFlow";
import { cn } from "./lib/cn";

function App() {
  // The flow lives here rather than in the chat panel because the booking step
  // reshapes the whole page, not just the panel the scheduler appears in.
  const flow = useChatFlow();
  const booking = flow.stage.name === "booking";

  return (
    /*
     * The ::before block bleeds the brand purple into the left gutter while the
     * wrapper's white fills the right one, so both panels run to the edge of the
     * page past the container. Through the questions the columns are an even
     * 50/50, so the seam between the two fills lines up exactly with the
     * boundary between the panels.
     *
     * At the booking step the brand column narrows to 25rem, so HubSpot's
     * scheduler has the width for its side-by-side calendar and times. The
     * purple fill then runs on under the chat panel, which hides it with its
     * own white.
     *
     * Both are lg-only: below that the brand column is gone and the chat panel
     * is the whole page, so there is no seam to place and no gutter to fill.
     */
    <div className="relative min-h-dvh bg-card lg:before:absolute lg:before:inset-y-0 lg:before:left-0 lg:before:w-1/2 lg:before:bg-primary lg:before:content-['']">
      <div
        className={cn(
          "relative mx-auto grid min-h-dvh max-w-[2200px] grid-cols-1",
          booking ? "lg:grid-cols-[25rem_minmax(0,1fr)]" : "lg:grid-cols-2",
        )}
      >
        <BrandPanel booking={booking} />
        <ChatPanel flow={flow} />
      </div>
    </div>
  );
}

export default App;
