import { useState } from "react";
import rulescapeLogoFull from "./assets/rulescape_logo.png";
import rulescapeLogoCrop from "./assets/rulescape_logo_crop.png";
import { BridgeStage } from "./stages/KnoxStage";
import { CelloStage } from "./stages/CelloStage";
import { MlStage } from "./stages/MlStage";
import { ReportStage } from "./stages/ResultStage";

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

const runParameterFields = [
  {
    id: "topN",
    label: "Top N",
    type: "number",
    value: "5",
    min: "1",
    step: "1",
  },
  {
    id: "iterations",
    label: "Iterations",
    type: "number",
    value: "25",
    min: "1",
    step: "1",
  },
  {
    id: "search",
    label: "Search",
    type: "select",
    value: "Exhaustive",
    options: ["Exhaustive", "Annealing"],
    fullWidth: true,
  },
  {
    id: "runLabel",
    label: "Run label",
    type: "text",
    value: "classic_single_input_run",
    fullWidth: true,
  },
];

const initialRunParams = Object.fromEntries(
  runParameterFields.map((item) => [item.id, item.value])
);

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [runParams, setRunParams] = useState(initialRunParams);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const currentStep = steps[activeIndex];
  const ActiveStage = stageComponents[currentStep.id];
  const logoSrc = sidebarCollapsed ? rulescapeLogoCrop : rulescapeLogoFull;
  const progressPercent = ((activeIndex + 1) / steps.length) * 100;

  const handleRunParamChange = (id, nextValue) => {
    setRunParams((current) => ({ ...current, [id]: nextValue }));
  };

  const goPrevious = () => setActiveIndex((value) => Math.max(0, value - 1));
  const goNext = () =>
    setActiveIndex((value) => Math.min(steps.length - 1, value + 1));

  return (
    <div className={`app-shell${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      <aside className={`sidebar card${sidebarCollapsed ? " collapsed" : ""}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={sidebarCollapsed ? "Expand pipeline steps" : "Collapse pipeline steps"}
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            <i className="fa-solid fa-bars" aria-hidden="true" />
          </button>
          <div className="sidebar-brand">
            <img className="hero-logo" src={logoSrc} alt="RuleScape logo" />
          </div>
        </div>

        <section className="sidebar-section">
          <span className="sidebar-label">Pipeline Steps</span>
          <div className="side-step-list">
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
                  className={`side-step ${state}`}
                  onClick={() => setActiveIndex(index)}
                  title={step.title}
                  aria-label={step.title}
                >
                  <span className="step-number">{step.number}</span>
                  <div className="side-step-copy">
                    <strong>{step.title}</strong>
                    <p>{step.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </aside>

      <main className="workspace">
        <header className="hero card">
          <div className="hero-topline">
            <span className="progress-kicker">Step {activeIndex + 1} of {steps.length}</span>
            <div className="hero-nav-inline">
              <button
                className="ghost-button nav-button"
                type="button"
                onClick={goPrevious}
                disabled={activeIndex === 0}
                aria-label="Previous step"
              >
                <i className="fa-solid fa-angle-left" aria-hidden="true" />
              </button>
              <button
                className="primary-button nav-button"
                type="button"
                onClick={goNext}
                disabled={activeIndex === steps.length - 1}
                aria-label="Next step"
              >
                <i className="fa-solid fa-angle-right" aria-hidden="true" />
              </button>
            </div>
          </div>

          <h1>{currentStep.title}</h1>
          <p className="muted hero-copy">{currentStep.summary}</p>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={activeIndex + 1}
            aria-label={`Step ${activeIndex + 1} of ${steps.length}`}
          >
            <span className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </header>

        <div className="content-grid">
          <section className="stage-view">
            <ActiveStage
              runParams={runParams}
              runParameterFields={runParameterFields}
              onRunParamChange={handleRunParamChange}
            />
          </section>

          <aside className="preview-rail">
            <section className="card preview-card">
              <span className="sidebar-label">Run parameters</span>
              <div className="config-grid compact-config-grid">
                {runParameterFields.map((field) => (
                  <ConfigField
                    key={field.id}
                    field={field}
                    value={runParams[field.id]}
                    onChange={handleRunParamChange}
                  />
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ConfigField({ field, value, onChange }) {
  return (
    <label className={`config-item${field.fullWidth ? " full-width" : ""}`}>
      <span>{field.label}</span>
      {field.type === "select" ? (
        <select
          className="config-control"
          value={value}
          onChange={(event) => onChange(field.id, event.target.value)}
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="config-control"
          type={field.type}
          value={value}
          min={field.min}
          step={field.step}
          onChange={(event) => onChange(field.id, event.target.value)}
        />
      )}
    </label>
  );
}
