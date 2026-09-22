import { BrandPanel } from "./components/BrandPanel";
import { ChatPanel } from "./components/ChatPanel";

function App() {
  return (
    /*
     * The ::before block bleeds the brand purple into the left gutter while the
     * wrapper's white fills the right one, so both panels run to the edge of the
     * page past the container. The columns are an even 50/50, so the seam between
     * the two fills lines up exactly with the boundary between the panels.
     *
     * Both are lg-only: below that the brand column is gone and the chat panel
     * is the whole page, so there is no seam to place and no gutter to fill.
     */
    <div className="relative min-h-screen bg-card lg:before:absolute lg:before:inset-y-0 lg:before:left-0 lg:before:w-1/2 lg:before:bg-primary lg:before:content-['']">
      <div className="relative mx-auto grid min-h-screen max-w-[2200px] grid-cols-1 lg:grid-cols-2">
        <BrandPanel />
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;
