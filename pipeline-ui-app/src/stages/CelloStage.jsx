const inputBundle = [
  {
    title: "Verilog",
    note: "logic/function the circuit should implement",
    button: "Upload .v",
  },
  {
    title: "UCF",
    note: "gate library, part library, and gate behavior",
    button: "Upload UCF",
  },
  {
    title: "input.json",
    note: "allowed input sensors",
    button: "Upload input.json",
  },
  {
    title: "output.json",
    note: "allowed output reporters",
    button: "Upload output.json",
  },
];

const runParameters = [
  { label: "Top N", value: "5" },
  { label: "Iterations", value: "25" },
  { label: "Search", value: "Exhaustive" },
  { label: "Run label", value: "classic_single_input_run" },
];

const sampleVerilog = `module classic_not_test(out1, in1);
  input in1;
  output out1;

  assign out1 = ~in1;
endmodule`;

export function CelloStage() {
  return (
    <div className="stage-grid">
      <section className="card">
        <h3>Input bundle</h3>
        <p className="muted">
          Keep the first step narrow: users should only think about the Cello
          run inputs and a few run parameters.
        </p>

        <div className="input-list">
          {inputBundle.map((item) => (
            <InputRow
              key={item.title}
              title={item.title}
              note={item.note}
              button={item.button}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Verilog editor</h3>
        <p className="muted">
          Inline editing should be the easiest path for small examples.
        </p>
        <textarea className="code-box" readOnly value={sampleVerilog} />
      </section>

      <section className="card compact-card">
        <h3>Run parameters</h3>
        <div className="config-grid">
          {runParameters.map((item) => (
            <ConfigItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>
    </div>
  );
}

function InputRow({ title, note, button }) {
  return (
    <div className="input-row">
      <div>
        <strong>{title}</strong>
        <p className="muted">{note}</p>
      </div>
      <button className="ghost-button" type="button">
        {button}
      </button>
    </div>
  );
}

function ConfigItem({ label, value }) {
  return (
    <div className="config-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
