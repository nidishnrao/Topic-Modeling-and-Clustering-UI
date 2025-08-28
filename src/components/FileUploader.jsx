import { useState, useEffect } from "react";

const httpTriggerUrl = "http://localhost:7071/api/topic-clustered-model-HTTP-trigger";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // new for color styling
  const [showVisuals, setShowVisuals] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setLinks(null);
      setStatus("");
      setShowVisuals(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatusType("info");
    setStatus("Sending file to server...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(httpTriggerUrl, {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (!response.ok) throw new Error("Azure Function call failed.");
        setLinks(result);
        setStatus("File processed successfully!");
        setStatusType("success");
      } catch (parseError) {
        alert("Upload failed: " + parseError.message);
        setStatus("Failed to parse response.");
        setStatusType("error");
      }
    } catch (err) {
      setStatus("Upload failed.");
      setStatusType("error");
    }
    setLoading(false);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .custom-btn:focus { outline: 2px solid #2563eb; }
      .custom-btn:hover { background: #1b4bc2; }
      .custom-btn:active { background: #17429a; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <div style={containerStyle}>
        <div style={formWrapperStyle}>
          <h2 style={headerStyle}>📁 Upload CSV or Excel for Topic Modeling</h2>

          <div style={formGroupStyle}>
            <label htmlFor="file" style={dropZoneStyle}>
              {file ? file.name : "Click to upload file"}
              <input
                type="file"
                accept=".csv, .xlsx"
                id="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>

            <button
              className="custom-btn"
              disabled={!file || loading}
              onClick={handleUpload}
              style={buttonStyle}
            >
              {loading ? (
                <>
                  <span style={spinnerStyle}></span> Processing...
                </>
              ) : (
                "Upload & Process"
              )}
            </button>
          </div>

          {status && (
            <p
              style={{
                ...statusStyle,
                color:
                  statusType === "success"
                    ? "#15803d"
                    : statusType === "error"
                    ? "#dc2626"
                    : "#555",
                backgroundColor:
                  statusType === "success"
                    ? "#ecfdf5"
                    : statusType === "error"
                    ? "#fef2f2"
                    : "#f3f4f6",
                border:
                  statusType === "success"
                    ? "1px solid #bbf7d0"
                    : statusType === "error"
                    ? "1px solid #fca5a5"
                    : "1px solid #e5e7eb",
              }}
            >
              {status}
            </p>
          )}

          {links && (
            <div style={resultContainer}>
              <h3 style={{ marginBottom: "1rem", fontWeight: 600 }}>Output</h3>
              <div style={buttonRowStyle}>
                {links.report && (
                  <a
                    href={links.report}
                    download
                    className="custom-btn"
                    style={{ ...buttonStyle, minWidth: 180, textAlign: "center", textDecoration: "none", display: "inline-flex", justifyContent: "center" }}
                  >
                    Download CSV Report
                  </a>
                )}
                <button
                  className="custom-btn"
                  style={{ ...buttonStyle, minWidth: 180, textAlign: "center" }}
                  onClick={() => setShowVisuals((prev) => !prev)}
                >
                  {showVisuals ? "Hide" : "View"} Visualizations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showVisuals && links && (
        <div style={gridWrapperStyle}>
          {links.hierarchy && (
            <iframe
              src={links.hierarchy}
              title="Hierarchy"
              style={gridItemStyle}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
          {links.barchart && (
            <iframe
              src={links.barchart}
              title="Bar Chart"
              style={gridItemStyle}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
          {links.distribution && (
            <iframe
              src={links.distribution}
              title="Distribution"
              style={gridItemStyle}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
          {links.heatmap && (
            <iframe
              src={links.heatmap}
              title="Heatmap"
              style={gridItemStyle}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      )}
    </>
  );
}

// ---- Styles ----
const containerStyle = {
  backgroundColor: "#f3f4f6",
  minHeight: "100vh",
  padding: "2rem 1rem",
};

const formWrapperStyle = {
  maxWidth: "480px",
  margin: "0 auto",
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
};

const headerStyle = {
  fontSize: "1.25rem",
  fontWeight: 600,
  marginBottom: "1.5rem",
  textAlign: "center",
  color: "#2563eb",
  letterSpacing: "0.4px",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
};

const dropZoneStyle = {
  padding: "2rem",
  width: "100%",
  border: "2px dashed #a5b4fc",
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: "#f7f8fa",
  fontSize: "1rem",
  textAlign: "center",
  color: "#64748b",
  transition: "border 0.2s",
  marginBottom: "0.5rem",
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "#fff",
  padding: "12px 0", // Full width
  minWidth: 180,
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  fontWeight: 500,
  transition: "background 0.18s",
  boxShadow: "0 1.5px 6px rgba(37,99,235,0.04)",
  justifyContent: "center"
};

const buttonRowStyle = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
  marginTop: "1rem"
};

const spinnerStyle = {
  width: "16px",
  height: "16px",
  border: "3px solid white",
  borderTop: "3px solid transparent",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const statusStyle = {
  marginTop: "1.5rem",
  fontStyle: "italic",
  color: "#555",
  textAlign: "center",
  padding: "0.8rem 1.2rem",
  borderRadius: "7px",
  fontSize: "1rem",
};

const resultContainer = {
  marginTop: "2.6rem",
  textAlign: "center"
};

const gridWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "1.5rem",
  padding: "2rem",
  backgroundColor: "#f9f9f9",
};

const gridItemStyle = {
  width: "100%",
  height: "400px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  boxShadow: "0 4px 18px rgba(16,30,82,0.07)",
  background: "#fff",
};
