import { BrandPanel } from "./components/BrandPanel";
import { ChatPanel } from "./components/ChatPanel";

function App() {
  return (
    /*
     * The ::before block bleeds the brand purple into the left gutter while the
     * wrapper's white fills the right one, so both panels run to the edge of the
     * page past the 1180px container. The columns are an even 50/50, so the seam
     * between the two fills lines up exactly with the boundary between the panels
     * at every width. Two flat fills rather than a gradient — a gradient across
     * this much area picks up visible dithering.
     */
    <div className="relative min-h-screen bg-white before:absolute before:inset-y-0 before:left-0 before:w-1/2 before:bg-brand-900 before:content-['']">
      <div className="relative mx-auto grid min-h-screen max-w-[2200px] grid-cols-1 lg:grid-cols-2">
        <BrandPanel />
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;
