import React, { useState } from 'react';

function AdvertisersView({ ads, issues, onSelectIssue, onEditAd, onDeleteAd }) {
  const [search, setSearch] = useState('');

  const expanded = ads.flatMap(ad =>
    ad.issues.length > 0
      ? ad.issues.map(issue => ({ ...ad, displayIssue: issue }))
      : [{ ...ad, displayIssue: '—' }]
  );

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

  const isFullyPlaced = (ad) => {
    return ad.issues.length > 0 && ad.issues.every(issue => ad.placed[issue]);
  };

  const isCompanyFullyPlaced = (companyAds) => {
    const uniqueAdIds = [...new Set(companyAds.map(r => r.id))];
    return uniqueAdIds.every(id => {
      const ad = ads.find(a => a.id === id);
      return ad && isFullyPlaced(ad);
    });
  };

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

      {filtered.map(([company, rows]) => {
        const fullyPlaced = isCompanyFullyPlaced(rows);
        return (
          <div key={company} className={`advertiser-card ${fullyPlaced ? 'fully-placed' : ''}`}>
            <div className="advertiser-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3>{company}</h3>
                {fullyPlaced && <span className="all-placed-badge">✓ All Placed</span>}
              </div>
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
                  <tr key={i} className={row.placed[row.displayIssue] ? 'placed' : ''}>
                    <td>
                      {row.displayIssue !== '—' ? (
                        <button
                          className="issue-link-btn"
                          onClick={() => onSelectIssue(row.displayIssue)}
                        >
                          {row.displayIssue}
                        </button>
                      ) : '—'}
                    </td>
                    <td>{row.size}</td>
                    <td>{row.soldBy}</td>
                    <td>
                      {row.adCopy ? (
                        <a href={row.adCopy} target="_blank" rel="noreferrer">View ↗</a>
                      ) : (
                        <span className="no-copy-warning">⚠️ Not received</span>
                      )}
                    </td>
                    <td>{row.notes || '—'}</td>
                    <td>
  <button className="edit-btn" onClick={() => onEditAd(ads.find(a => a.id === row.id))}>Edit</button>
  <button className="delete-btn" onClick={() => {
    if (window.confirm(`Delete ${row.company}?`)) onDeleteAd(row.id);
  }}>Delete</button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default AdvertisersView;