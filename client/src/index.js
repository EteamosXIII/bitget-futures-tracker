import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App = () => {
  const [contracts, setContracts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/new-futures');
    const json = await res.json();
    setContracts(json.new);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 30 }}>
      <h1>🚀 Bitget New Futures Tracker</h1>
      <button onClick={fetchData}>🔄 Refresh</button>
      {loading && <p>Loading...</p>}
      <ul>
        {contracts.map((item) => (
          <li key={item.symbol}>
            <strong>{item.symbol}</strong> — {item.quoteCoin}
          </li>
        ))}
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
