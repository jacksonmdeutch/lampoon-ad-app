import React, { useState } from 'react';

function IssuesView({ ads, issues, onTogglePlaced, onAddIssue }) {
  const [selectedIssue, setSelectedIssue] = useState(issues[0]);
  const [newIssueName, setNewIssueName] = useState('');
  const [showAddIssue, setShowAddIssue] = useState(false);

  const adsForIssue = ads.filter(ad => ad.issues.includes(selectedIssue));

  const handleAddIssue = () => {
    if (newIssueName.trim()) {
      onAddIssue(newIssueName.trim());
      setSelectedIssue(newIssueName.trim());
      setNewIssueName('');
      setShowAddIssue(false);
    }
  };

  return (
    <div>
      <div className="issue-tabs">
        {issues.map(issue => (
          <button
            key={issue}
            className={selectedIssue === issue ? 'active' : ''}
            onClick={() => setSelectedIssue(issue)}
          >
            {issue}
          </button>
        ))}
        <button className="add-issue-btn" onClick={() => setShowAddIssue(!showAddIssue)}>
          + Add Issue
        </button>
      </div>

      {showAddIssue && (
        <div className="add-issue-form">
          <input
            type="text"
            placeholder="Issue name (e.g. Lauren's Issue)"
            value={newIssueName}
            onChange={e => setNewIssueName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddIssue()}
          />
          <button onClick={handleAddIssue}>Add</button>
        </div>
      )}

      <div className="issue-summary">
        <h2>{selectedIssue}</h2>
        <span>{adsForIssue.length} ads · {adsForIssue.filter(ad => ad.placed[selectedIssue]).length} placed</span>
      </div>

      <table className="ads-table">
        <thead>
          <tr>
            <th>Placed</th>
            <th>Advertiser</th>
            <th>Size</th>
            <th>Sold By</th>
            <th>Ad Copy</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {adsForIssue.map(ad => (
            <tr key={ad.id} className={ad.placed[selectedIssue] ? 'placed' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={!!ad.placed[selectedIssue]}
                  onChange={() => onTogglePlaced(ad.id, selectedIssue)}
                />
              </td>
              <td>{ad.company}</td>
              <td>{ad.size}</td>
              <td>{ad.soldBy}</td>
              <td>
                            {ad.adCopy ? (
                  <a href={ad.adCopy} target="_blank" rel="noreferrer">View</a>
                ) : (
                  <span className="no-copy-warning" title="Ad copy not yet received">⚠️ Not received</span>
                )}
              </td>
              <td>{ad.notes || '—'}</td>
            </tr>
          ))}
          {adsForIssue.length === 0 && (
            <tr><td colSpan="6">No ads for this issue yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IssuesView;