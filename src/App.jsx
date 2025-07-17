import './index.css';
import FileUploader from './components/FileUploader';

export default function App() {
  return (
    <div>
      <header style={headerStyle}>
        <h1> Topic Modeling and Clustering Dashboard</h1>
      </header>
      <main style={mainStyle}>
        <FileUploader />
      </main>
    </div>
  );
}

const headerStyle = {
  backgroundColor: '#2b6cb0',
  color: 'white',
  padding: '1rem 2rem',
  textAlign: 'center',
  fontSize: '1.5rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const mainStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 0 10px rgba(0,0,0,0.05)',
};
