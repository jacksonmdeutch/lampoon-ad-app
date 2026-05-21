import React, { useState } from 'react';

function AdvertisersView({ ads }) {
  const [search, setSearch] = useState('');

  // Expand ads so each issue is its own row
  const expanded = ads.flatMap(ad =>
    ad.issues.length > 0
      ? ad.issues.map(issue => ({ ...ad, displayIssue: issue }))
      : [{ ...ad, displayIssue: '—' }]
  );

  // Group expanded rows by company
  const grouped = expanded.reduce((acc, row) => {
    if (!acc[row.company]) acc[row.company] = [];
    acc[row.company].push(row);
    return acc;
  }, {});

  const filtered = Object.entries(grouped).filter(([company]) =>
    company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPlacements = expanded.length;
  const totalAdvertisers = Object.keys(grouped).length;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>By Advertiser</h2>
          <span className="advertiser-count">{totalAdvertisers} advertisers · {totalPlacements} total placements</span>
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search advertiser..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && <p>No advertisers found.</p>}

      {filtered.map(([company, rows]) => (
        <div key={company} className="advertiser-card">
          <div className="advertiser-header">
            <h3>{company}</h3>
            <span>{rows.length} placement{rows.length > 1 ? 's' : ''}</span>
          </div>
          <table className="ads-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Size</th>
                <th>Sold By</th>
                <th>Ad Copy</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.displayIssue}</td>
                  <td>{row.size}</td>
                  <td>{row.soldBy}</td>
                  <td>
                    {row.adCopy ? (
                      <a href={row.adCopy} target="_blank" rel="noreferrer">View</a>
                    ) : (
                      <span className="no-copy-warning" title="Ad copy not yet received">⚠️ Not received</span>
                    )}
                  </td>
                  <td>{row.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default AdvertisersView;