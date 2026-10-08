import { AppHeader } from './components/AppHeader';
import { GateScreen } from './components/gate/GateScreen';
import { ReportScreen } from './components/report/ReportScreen';
import { ScanScreen } from './components/scan/ScanScreen';
import { StartScreen } from './components/start/StartScreen';
import { useAuditFlow } from './hooks/useAuditFlow';

function App() {
  const flow = useAuditFlow();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader onRestart={flow.step === 'report' ? flow.restart : undefined} />

      {flow.step === 'start' && <StartScreen onStart={flow.start} />}

      {flow.step === 'scan' && (
        <ScanScreen
          domain={flow.domain}
          progress={flow.progress}
          report={flow.report}
          answers={flow.answers}
          onAnswer={flow.answer}
          onResetAnswers={flow.resetAnswers}
          onShowScore={flow.showScore}
        />
      )}

      {flow.step === 'gate' && <GateScreen report={flow.report} onUnlock={flow.unlock} />}

      {flow.step === 'report' && (
        <ReportScreen report={flow.report} answers={flow.answers} lead={flow.lead} ranAt={flow.ranAt} />
      )}
    </div>
  );
}

export default App;
