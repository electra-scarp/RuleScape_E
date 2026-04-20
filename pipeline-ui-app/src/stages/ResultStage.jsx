const rankedDesigns = [
  { rank: 1, gate: "Switch_003", score: "1.5052", status: "best" },
  { rank: 2, gate: "Switch_001", score: "1.4767", status: "candidate" },
  { rank: 3, gate: "Switch_005", score: "1.4693", status: "candidate" },
];

const explanationRows = [
  { label: "promoter before operator", value: 88 },
  { label: "switch family choice", value: 76 },
  { label: "output reporter stability", value: 61 },
];

export function ReportStage() {
  return (
    <div className="stage-grid">
      <section className="card">
        <h3>Ranked designs</h3>
        <p className="muted">
          Final review should prioritize outcomes: which designs ranked highest
          and what the model thinks matters.
        </p>
        <table className="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Gate</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rankedDesigns.map((row) => (
              <tr key={row.rank}>
                <td>{row.rank}</td>
                <td>
                  <code>{row.gate}</code>
                </td>
                <td>{row.score}</td>
                <td>
                  <span className={`chip ${row.status === "best" ? "ready" : "pending"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card compact-card">
        <h3>Top explanations</h3>
        <div className="bar-list">
          {explanationRows.map((row) => (
            <div className="bar-row" key={row.label}>
              <span>{row.label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${row.value}%` }} />
              </div>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
