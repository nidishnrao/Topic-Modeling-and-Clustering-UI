import { useState, useEffect } from "react";

const httpTriggerUrl = "http://localhost:7071/api/topic-clustered-model-HTTP-trigger";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState(null);
  const [status, setStatus] = useState("");
  const [showVisuals, setShowVisuals] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLinks(null);
    setStatus("");
    setShowVisuals(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
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
      } catch (parseError) {
        alert("Upload failed: " + parseError.message);
        setStatus("Failed to parse response.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Upload failed.");
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <div style={containerStyle}>
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

        {status && <p style={statusStyle}>{status}</p>}

        {links && (
          <div style={resultContainer}>
            <h3>✅ Output</h3>
            <ul style={ulStyle}>
              {links.report && (
                <li>
                  <a href={links.report} download style={linkStyle}>
                    📄 Download CSV Report
                  </a>
                </li>
              )}
              <li>
                <button
                  style={linkStyle}
                  onClick={() => setShowVisuals((prev) => !prev)}
                >
                  📊 {showVisuals ? "Hide" : "View"} Visualizations
                </button>
              </li>
            </ul>
          </div>
        )}
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

const containerStyle = {
  textAlign: "center",
  padding: "2rem",
};

const headerStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1.5rem",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
};

const dropZoneStyle = {
  padding: "2rem",
  width: "90%",
  maxWidth: "500px",
  border: "2px dashed #ccc",
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: "#f7f7f7",
  fontSize: "1rem",
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "#fff",
  padding: "12px 24px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
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
  marginTop: "1rem",
  fontStyle: "italic",
  color: "#555",
};

const resultContainer = {
  marginTop: "2rem",
};

const ulStyle = {
  listStyle: "none",
  padding: 0,
  marginTop: "1rem",
};

const linkStyle = {
  display: "inline-block",
  margin: "0.5rem 0",
  padding: "0.5rem 1rem",
  backgroundColor: "#edf2f7",
  borderRadius: "6px",
  textDecoration: "none",
  color: "#2b6cb0",
  fontWeight: "500",
  border: "none",
  cursor: "pointer",
};

const gridWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.5rem",
  padding: "2rem",
  backgroundColor: "#f9f9f9",
  justifyContent: "center",
};

const gridItemStyle = {
  width: "100%",
  height: "400px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};
