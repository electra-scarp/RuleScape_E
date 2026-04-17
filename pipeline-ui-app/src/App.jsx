import { useMemo, useState } from "react";
import { BridgeStage } from "./stages/BridgeStage";
import { CelloStage } from "./stages/CelloStage";
import { MlStage } from "./stages/MlStage";
import { ReportStage } from "./stages/ReportStage";

const steps = [
  {
    id: "cello",
    number: "01",
    title: "Configure Cello",
    subtitle: "Define the synthesis bundle",
    summary: "Upload or author the Verilog, UCF, input JSON, and output JSON.",
  },
  {
    id: "bridge",
    number: "02",
    title: "Review Knox",
    subtitle: "Check the adapter package",
    summary: "Confirm how the selected Cello designs become Knox-ready CSV files.",
  },
  {
    id: "ml",
    number: "03",
    title: "Configure ML",
    subtitle: "Choose models and targets",
    summary: "Set the feature source, score target, and model family for training.",
  },
  {
    id: "report",
    number: "04",
    title: "Review Results",
    subtitle: "Inspect rankings and explanations",
    summary: "Read the ranked candidates, rule signals, and generated artifacts.",
  },
];

const stageComponents = {
  cello: CelloStage,
  bridge: BridgeStage,
  ml: MlStage,
  report: ReportStage,
};

const pipelineSummary = [
  { label: "Top N", value: "5" },
  { label: "Iterations", value: "25" },
  { label: "Current UCF", value: "v6" },
  { label: "Latest best score", value: "1.5052" },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStep = steps[activeIndex];
  const ActiveStage = stageComponents[currentStep.id];

  const progressLabel = useMemo(
    () => `${activeIndex + 1} / ${steps.length}`,
    [activeIndex]
  );

  const goPrevious = () => setActiveIndex((value) => Math.max(0, value - 1));
  const goNext = () =>
    setActiveIndex((value) => Math.min(steps.length - 1, value + 1));

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">RuleScape</span>
          <h1>Pipeline</h1>
          <p className="muted hero-copy">
            This version is intentionally linear. The interface is designed to
            make the order of operations obvious: define the Cello run, inspect
            the Knox handoff, configure ML, then review the results.
          </p>
        </div>

        <div className="hero-status">
          <span className="eyebrow soft">Current step</span>
          <strong>{currentStep.number}</strong>
          <span>{currentStep.title}</span>
        </div>
      </header>

      <section className="stepper" aria-label="Pipeline steps">
        {steps.map((step, index) => {
          const state =
            index === activeIndex
              ? "active"
              : index < activeIndex
                ? "complete"
                : "upcoming";

          return (
            <button
              key={step.id}
              type="button"
              className={`step-card ${state}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="step-number">{step.number}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.subtitle}</p>
              </div>
            </button>
          );
        })}
      </section>

      <div className="workspace">
        <main className="stage-view">
          <section className="stage-header card">
            <div>
              <span className="eyebrow">{progressLabel}</span>
              <h2>{currentStep.title}</h2>
              <p className="muted">{currentStep.summary}</p>
            </div>

            <div className="stage-controls">
              <button
                className="ghost-button"
                type="button"
                onClick={goPrevious}
                disabled={activeIndex === 0}
              >
                Previous
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={goNext}
                disabled={activeIndex === steps.length - 1}
              >
                Next step
              </button>
            </div>
          </section>

          <ActiveStage />
        </main>

        <aside className="context-column">
          <section className="card context-card">
            <span className="eyebrow soft">Pipeline summary</span>
            {pipelineSummary.map((item) => (
              <div className="summary-row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </section>

          <section className="card context-card">
            <span className="eyebrow soft">Launch action</span>
            <button className="primary-button wide" type="button">
              Launch pipeline
            </button>
            <p className="muted compact">
              Keep one primary launch action visible throughout the pipeline
              instead of repeating it inside each stage.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
