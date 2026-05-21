import React, { useState } from 'react';
import './App.css';
import IssuesView from './IssuesView';
import AdvertisersView from './AdvertisersView';
import AddAdForm from './AddAdForm';
import EditAdForm from './EditAdForm';
import { ADS, ISSUES } from './data';

function App() {
  const [view, setView] = useState('issues');
  const [ads, setAds] = useState(ADS);
  const [issues, setIssues] = useState(ISSUES);
  const [printedIssues, setPrintedIssues] = useState([]);
  const [showAddAd, setShowAddAd] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editingAd, setEditingAd] = useState(null);

  const handleTogglePlaced = (adId, issue) => {
    setAds(ads.map(ad => {
      if (ad.id !== adId) return ad;
      return { ...ad, placed: { ...ad.placed, [issue]: !ad.placed[issue] } };
    }));
  };

  const handleEditAd = (updatedAd, updatedIssues) => {
    setAds(ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
    if (updatedIssues) {
      updatedIssues.forEach(issue => {
        if (!issues.includes(issue)) {
          setIssues(prev => [...prev, issue]);
        }
      });
    }
  };

  const handleAddIssue = (name) => {
    if (!issues.includes(name)) setIssues([...issues, name]);
  };

  const handleAddAd = (newAd, updatedIssues) => {
    setAds([...ads, newAd]);
    if (updatedIssues) {
      updatedIssues.forEach(issue => {
        if (!issues.includes(issue)) {
          setIssues(prev => [...prev, issue]);
        }
      });
    }
  };

  const handleToggleIssuePrinted = (issue) => {
    setPrintedIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    setView('issues');
  };

  const handleExportCSV = () => {
    const headers = [
      'Company', 'Sold By', 'Size', 'Issues', 'Num Issues',
      'Issues Placed', 'Issues Remaining', 'Ad Copy', 'Notes'
    ];

    const rows = ads.map(ad => {
      const placedIssues = ad.issues.filter(issue => ad.placed[issue]);
      const remainingCount = ad.issues.length - placedIssues.length;
      
      return [
        ad.company,
        ad.soldBy,
        ad.size,
        ad.issues.join('; '),
        ad.numIssues,
        placedIssues.length > 0 ? placedIssues.join('; ') : 'None',
        remainingCount === 0 ? 'COMPLETED' : String(remainingCount),
        ad.adCopy || 'Not received',
        ad.notes || ''
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lampoon-ads.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Lampoon <span>Ad Tracker</span></h1>
        <div className="header-right">
          <button className="export-btn" onClick={handleExportCSV}>↓ Export CSV</button>
          <button className="add-ad-btn" onClick={() => setShowAddAd(true)}>+ Add Ad</button>
          <nav>
            <button className={view === 'issues' ? 'active' : ''} onClick={() => setView('issues')}>By Issue</button>
            <button className={view === 'advertisers' ? 'active' : ''} onClick={() => setView('advertisers')}>By Advertiser</button>
          </nav>
        </div>
      </header>

      <main>
        {view === 'issues' && (
    <IssuesView
      ads={ads}
      issues={issues}
      printedIssues={printedIssues}
      selectedIssue={selectedIssue}
      onTogglePlaced={handleTogglePlaced}
      onAddIssue={handleAddIssue}
      onToggleIssuePrinted={handleToggleIssuePrinted}
      onEditAd={setEditingAd}
    />
  )}
        {view === 'advertisers' && (
  <AdvertisersView
    ads={ads}
    issues={issues}
    onSelectIssue={handleSelectIssue}
    onEditAd={setEditingAd}
  />
)}
      </main>

      {showAddAd && (
        <AddAdForm
          issues={issues}
          onAddAd={handleAddAd}
          onClose={() => setShowAddAd(false)}
        />
      )}

      {editingAd && (
        <EditAdForm
          ad={editingAd}
          issues={issues}
          onSave={handleEditAd}
          onClose={() => setEditingAd(null)}
        />
      )}

      {editingAd && (
        <EditAdForm
          ad={editingAd}
          issues={issues}
          onSave={handleEditAd}
          onClose={() => setEditingAd(null)}
        />
      )}
    </div>
  );
}

export default App;