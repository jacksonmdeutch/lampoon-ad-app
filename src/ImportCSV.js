import React, { useState } from 'react';
import Papa from 'papaparse';

function ImportCSV({ issues, onImport, onClose }) {
  const [step, setStep] = useState('upload');
  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseIssue = (str) => {
    if (!str) return [];
    const lower = str.toLowerCase();
    const found = [];
    if (lower.includes('graduation') || lower.includes('commencement')) found.push('Commencement');
    if (lower.includes('back to school') || lower.includes('matt')) found.push('Matt');
    if (lower.includes('destination')) found.push('Destination');
    if (lower.includes('150th')) found.push('150th');
    if (lower.includes('sterling')) found.push('Sterling');
    if (lower.includes('hamza')) found.push('Hamza');
    return found.length > 0 ? found : ['Unknown'];
  };

  const parseSize = (str) => {
    if (!str) return '';
    // Extract just the size part before the dash
    const parts = str.split(/[-–]/);
    return parts[0].trim();
  };

  const buildAd = (row) => {
    const whatSold = row['What did you sell? Ad? Banner? What type of ad? For when?'] || '';
    const issuesFound = parseIssue(whatSold);
    const size = parseSize(whatSold);
    const adCopyReceived = (row['Ad Copy Received? (Yes/No)'] || '').toLowerCase() === 'yes';
    const adCopyLink = row['Link to Ad Copy'] || '';

    return {
      company: row['Company Name'] || '',
      soldBy: '',
      size: size,
      issues: issuesFound,
      numIssues: issuesFound.length,
      adCopy: adCopyReceived ? adCopyLink : '',
      notes: row['Other notes'] || '',
      placed: {},
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Skip the second header row (index 0 after parsing)
        const validRows = results.data.filter((row, i) => {
          const company = row['Company Name'] || '';
          return company.trim() !== '' && !company.includes('Paid?');
        });

        setRows(validRows);
        const previewAds = validRows.slice(0, 5).map(buildAd);
        setPreview(previewAds);
        setLoading(false);
        setStep('preview');
      },
      error: () => {
        setError('Could not read the file. Make sure it is a CSV.');
        setLoading(false);
      }
    });
  };

  const handleImport = () => {
    const allAds = rows.map(buildAd);
    onImport(allAds);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: '680px' }}>
        <h2>Import CSV</h2>

        {step === 'upload' && (
          <div>
            <p style={{ color: '#888', marginBottom: '16px', fontSize: '0.9rem' }}>
              Upload a CSV exported from Google Sheets or Excel.
            </p>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            {loading && <p style={{ marginTop: '16px', color: '#888' }}>Reading your spreadsheet...</p>}
            {error && <p style={{ marginTop: '16px', color: 'red' }}>{error}</p>}
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div>
            <p style={{ color: '#888', marginBottom: '12px', fontSize: '0.9rem' }}>
              Here's a preview of the first 5 ads to be imported:
            </p>

            <table className="ads-table" style={{ fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Size</th>
                  <th>Issues</th>
                  <th>Ad Copy</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((ad, i) => (
                  <tr key={i}>
                    <td>{ad.company || '—'}</td>
                    <td>{ad.size || '—'}</td>
                    <td>{ad.issues.join(', ') || '—'}</td>
                    <td>{ad.adCopy ? '✓ Yes' : '⚠️ Not received'}</td>
                    <td>{ad.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: '12px', color: '#888', fontSize: '0.85rem' }}>
              {rows.length} total ads will be imported.
            </p>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setStep('upload')}>← Back</button>
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
              <button className="submit-btn" onClick={handleImport}>
                Import {rows.length} Ads
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportCSV;