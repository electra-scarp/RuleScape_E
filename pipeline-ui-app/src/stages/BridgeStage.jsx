const exportedFiles = [
  { name: "designs.csv", note: "ordered selected parts per exported design" },
  {
    name: "part_library.csv",
    note: "all part IDs and roles from the UCF lookup",
  },
  { name: "weight.csv", note: "Cello circuit score for each exported design" },
  {
    name: "adapter_result.json",
    note: "human-readable summary of ranked candidates",
  },
];

const selectedParts = [
  "design_col_1_2",
  "design_col_2_3",
  "design_col_3_5",
  "design_col_4_1",
  "design_col_5_11",
  "design_col_6_3",
];

export function BridgeStage() {
  return (
    <div className="stage-grid">
      <section className="card">
        <h3>Adapter mapping</h3>
        <p className="muted">
          This step should explain the handoff, not hide it. Users need to see
          exactly what is being translated.
        </p>

        <div className="mapping-list">
          <MappingItem
            left="selected parts from the resolved design_assignment"
            right="designs.csv"
          />
          <MappingItem
            left="all part IDs and roles derived from the UCF"
            right="part_library.csv"
          />
          <MappingItem
            left="Cello circuit score for each exported design"
            right="weight.csv"
          />
        </div>
      </section>

      <section className="card">
        <h3>Generated package</h3>
        <p className="muted">
          Treat the adapter output as a package the user can review before
          sending it into Knox.
        </p>

        <div className="file-list">
          {exportedFiles.map((file) => (
            <div className="file-row" key={file.name}>
              <div>
                <strong>{file.name}</strong>
                <p className="muted">{file.note}</p>
              </div>
              <span className="chip ready">ready</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card compact-card">
        <h3>Selected design preview</h3>
        <div className="part-strip">
          {selectedParts.map((part) => (
            <span key={part} className="part-pill">
              {part}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function MappingItem({ left, right }) {
  return (
    <div className="mapping-row">
      <span>{left}</span>
      <code>{right}</code>
    </div>
  );
}
