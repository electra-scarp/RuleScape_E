import { useRef, useState } from "react";

const importableFiles = [
  { name: "designs.csv", note: "ordered selected parts per exported design", accept: ".csv" },
  { name: "part_library.csv", note: "all part IDs and roles from the UCF lookup", accept: ".csv" },
  { name: "rules.csv", note: "scoring and constraint rules for Knox", accept: ".csv" },
];

const exportedFiles = [
  { name: "designs.csv", note: "ordered selected parts per exported design" },
  { name: "part_library.csv", note: "all part IDs and roles from the UCF lookup" },
  { name: "rules.csv", note: "GOLDBAR rules for ranking" },
  { name: "weight.csv", note: "Cello circuit score for each exported design" },
  { name: "adapter_result.json", note: "human-readable summary of ranked candidates" },
];


const selectedParts = [
  "design_col_1_2",
  "design_col_2_3",
  "design_col_3_5",
  "design_col_4_1",
  "design_col_5_11",
  "design_col_6_3",
];

const initialImportedFiles = Object.fromEntries(
  importableFiles.map((f) => [f.name, { content: "", fileName: "" }])
);

export function BridgeStage() {
  const [openName, setOpenName] = useState(null);
  const [importedFiles, setImportedFiles] = useState(initialImportedFiles);
  const fileInputs = useRef({});

  const toggleOpen = (name) => {
    setOpenName((current) => (current === name ? null : name));
  };

  const handleContentChange = (name, nextValue) => {
    setImportedFiles((current) => ({
      ...current,
      [name]: { ...current[name], content: nextValue },
    }));
  };

  const triggerFilePicker = (name) => {
    fileInputs.current[name]?.click();
  };

  const handleFileImport = (fileSpec, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(fileSpec.accept.toLowerCase())) {
      window.alert(`Please upload a ${fileSpec.accept} file for ${fileSpec.name}.`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImportedFiles((current) => ({
        ...current,
        [fileSpec.name]: {
          content: String(reader.result ?? ""),
          fileName: file.name,
        },
      }));
      setOpenName(fileSpec.name);
    };
    reader.readAsText(file);
  };

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
        <h3>Input bundle</h3>
        <p className="muted">
          Upload the CSV files and rules required before running Knox.
        </p>
        <div className="input-list accordion-list">
          {importableFiles.map((fileSpec) => {
            const isOpen = openName === fileSpec.name;
            const imported = importedFiles[fileSpec.name];

            return (
              <article key={fileSpec.name} className={`input-card${isOpen ? " open" : ""}`}>
                <div className="input-header">
                  <button
                    className="input-toggle"
                    type="button"
                    onClick={() => toggleOpen(fileSpec.name)}
                    aria-expanded={isOpen}
                  >
                    <span className={`input-chevron${isOpen ? " open" : ""}`}>
                      <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                    </span>
                    <div>
                      <strong>{fileSpec.name}</strong>
                      <p className="muted">{fileSpec.note}</p>
                    </div>
                  </button>

                  <div className="input-header-meta">
                    {imported.fileName ? (
                      <span className="chip pending mono">{imported.fileName}</span>
                    ) : null}

                    <input
                      ref={(el) => { fileInputs.current[fileSpec.name] = el; }}
                      className="hidden-file-input"
                      type="file"
                      accept={fileSpec.accept}
                      onChange={(event) => handleFileImport(fileSpec, event)}
                    />

                    <button
                      className="ghost-button upload-button"
                      type="button"
                      onClick={() => triggerFilePicker(fileSpec.name)}
                      aria-label={`Import ${fileSpec.name}`}
                    >
                      <i className="fa-solid fa-upload" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="input-body" aria-hidden={!isOpen}>
                  <div className="input-panel">
                    <textarea
                      className="code-box"
                      value={imported.content}
                      onChange={(event) => handleContentChange(fileSpec.name, event.target.value)}
                      placeholder={`Import or type ${fileSpec.name} content`}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h3>Generated package</h3>
        <p className="muted">
          Treat the adapter output as a package the user can review before
          sending it into Knox.
        </p>
        <div className="file-list">
          {exportedFiles.map((file) => {
            const allUploaded = importableFiles.every(
              (f) => importedFiles[f.name].fileName
            );
            let status;
            if (file.name === "designs.csv" || file.name === "part_library.csv" || file.name === "rules.csv") {
              status = importedFiles[file.name]?.fileName ? "ready" : "pending";
            } else if (file.name === "weight.csv") {
              status = importedFiles["designs.csv"].fileName ? "ready" : "pending";
            } else {
              status = allUploaded ? "ready" : "pending";
            }
            return (
              <div className="file-row" key={file.name}>
                <div>
                  <strong>{file.name}</strong>
                  <p className="muted">{file.note}</p>
                </div>
                <span className={`chip ${status}`}>{status}</span>
              </div>
            );
          })}
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