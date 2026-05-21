import React, { useState } from 'react';

function IssuesView({ ads, issues, printedIssues, selectedIssue: initialIssue, onTogglePlaced, onAddIssue, onToggleIssuePrinted, onEditAd }) {
  const [selectedIssue, setSelectedIssue] = useState(initialIssue || issues[0]);
  const [newIssueName, setNewIssueName] = useState('');
  const [showAddIssue, setShowAddIssue] = useState(false);
  

  const adsForIssue = ads.filter(ad => ad.issues.includes(selectedIssue));
  const isPrinted = printedIssues.includes(selectedIssue);

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
            className={`${selectedIssue === issue ? 'active' : ''} ${printedIssues.includes(issue) ? 'printed' : ''}`}
            onClick={() => setSelectedIssue(issue)}
          >
            {printedIssues.includes(issue) ? '✓ ' : ''}{issue}
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
        <div className="issue-summary-left">
          <h2 style={{ textDecoration: isPrinted ? 'line-through' : 'none', opacity: isPrinted ? 0.5 : 1 }}>
            {selectedIssue}
          </h2>
          <span>{adsForIssue.length} ads · {adsForIssue.filter(ad => ad.placed[selectedIssue]).length} placed</span>
          {isPrinted && <span className="printed-badge">✓ Printed</span>}
        </div>
        <button
          className={isPrinted ? 'unprint-btn' : 'mark-printed-btn'}
          onClick={() => onToggleIssuePrinted(selectedIssue)}
        >
          {isPrinted ? 'Mark as Unprinted' : '🖨 Mark as Printed'}
        </button>
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
            <th></th>
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
              <td><strong>{ad.company}</strong></td>
              <td>{ad.size}</td>
              <td>{ad.soldBy}</td>
              <td>
                {ad.adCopy ? (
                  <a href={ad.adCopy} target="_blank" rel="noreferrer">View ↗</a>
                ) : (
                  <span className="no-copy-warning">⚠️ Not received</span>
                )}
              </td>
              <td>{ad.notes || '—'}</td>
              <td>
  <button className="edit-btn" onClick={() => onEditAd(ad)}>Edit</button>
</td>
            </tr>
          ))}
          {adsForIssue.length === 0 && (
            <tr><td colSpan="6" style={{textAlign:'center', color:'#aaa', padding:'24px'}}>No ads for this issue yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IssuesView;