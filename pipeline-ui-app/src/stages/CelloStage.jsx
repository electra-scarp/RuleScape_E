import { useRef, useState } from "react";

const inputBundle = [
  {
    id: "verilog",
    title: "Verilog",
    note: "logic/function the circuit should implement",
    accept: ".v",
    placeholder: "Import or write the Verilog specification",
  },
  {
    id: "ucf",
    title: "UCF",
    note: "gate library, part library, and gate behavior",
    accept: ".json",
    placeholder: "Import or write the UCF JSON",
  },
  {
    id: "inputJson",
    title: "input.json",
    note: "allowed input sensors",
    accept: ".json",
    placeholder: "Import or write the input JSON",
  },
  {
    id: "outputJson",
    title: "output.json",
    note: "allowed output reporters",
    accept: ".json",
    placeholder: "Import or write the output JSON",
  },
];

const initialValues = Object.fromEntries(inputBundle.map((item) => [item.id, ""]));
const initialImportedNames = Object.fromEntries(inputBundle.map((item) => [item.id, ""]));

export function CelloStage() {
  const [openId, setOpenId] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [importedNames, setImportedNames] = useState(initialImportedNames);
  const fileInputs = useRef({});

  const toggleOpen = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const handleValueChange = (id, nextValue) => {
    setValues((current) => ({ ...current, [id]: nextValue }));
  };

  const triggerFilePicker = (id) => {
    fileInputs.current[id]?.click();
  };

  const handleFileImport = (item, event) => {
    const id = item.id;
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(item.accept.toLowerCase())) {
      window.alert(`Please upload a ${item.accept} file for ${item.title}.`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValues((current) => ({ ...current, [id]: String(reader.result ?? "") }));
      setImportedNames((current) => ({ ...current, [id]: file.name }));
      setOpenId(id);
    };
    reader.readAsText(file);
  };

  return (
    <div className="stage-grid">
      <section className="card">
        <h3>Input bundle</h3>
        <p className="muted">
          Keep the first step narrow: users should only think about the Cello
          run inputs and a few run parameters.
        </p>

        <div className="input-list accordion-list">
          {inputBundle.map((item) => {
            const isOpen = openId === item.id;
            const importedName = importedNames[item.id];

            return (
              <article key={item.id} className={`input-card${isOpen ? " open" : ""}`}>
                <div className="input-header">
                  <button
                    className="input-toggle"
                    type="button"
                    onClick={() => toggleOpen(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className={`input-chevron${isOpen ? " open" : ""}`}>
                      <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <p className="muted">{item.note}</p>
                    </div>
                  </button>

                  <div className="input-header-meta">
                    {importedName ? (
                      <span className="chip pending mono">{importedName}</span>
                    ) : null}

                    <input
                      ref={(element) => {
                        fileInputs.current[item.id] = element;
                      }}
                      className="hidden-file-input"
                      type="file"
                      accept={item.accept}
                      onChange={(event) => handleFileImport(item, event)}
                    />

                    <button
                      className="ghost-button upload-button"
                      type="button"
                      onClick={() => triggerFilePicker(item.id)}
                      aria-label={`Import ${item.title}`}
                    >
                      <i className="fa-solid fa-upload" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="input-body" aria-hidden={!isOpen}>
                  <div className="input-panel">
                    <textarea
                      className="code-box"
                      value={values[item.id]}
                      onChange={(event) => handleValueChange(item.id, event.target.value)}
                      placeholder={item.placeholder}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
