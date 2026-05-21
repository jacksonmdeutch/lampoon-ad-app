import React, { useState } from 'react';
import './App.css';
import IssuesView from './IssuesView';
import AddAdForm from './AddAdForm';
import { ADS, ISSUES } from './data';
import AdvertisersView from './AdvertisersView';

function App() {
  const [view, setView] = useState('issues');
  const [ads, setAds] = useState(ADS);
  const [issues, setIssues] = useState(ISSUES);
  const [showAddAd, setShowAddAd] = useState(false);

  const handleTogglePlaced = (adId, issue) => {
    setAds(ads.map(ad => {
      if (ad.id !== adId) return ad;
      return { ...ad, placed: { ...ad.placed, [issue]: !ad.placed[issue] } };
    }));
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

  return (
    <div className="app">
      <header className="header">
        <h1>Lampoon Ad Tracker</h1>
        <div className="header-right">
          <button className="add-ad-btn" onClick={() => setShowAddAd(true)}>
            + Add Ad
          </button>
          <nav>
            <button
              className={view === 'issues' ? 'active' : ''}
              onClick={() => setView('issues')}
            >
              By Issue
            </button>
            <button
              className={view === 'advertisers' ? 'active' : ''}
              onClick={() => setView('advertisers')}
            >
              By Advertiser
            </button>
          </nav>
        </div>
      </header>

      <main>
        {view === 'issues' && (
          <IssuesView
            ads={ads}
            issues={issues}
            onTogglePlaced={handleTogglePlaced}
            onAddIssue={handleAddIssue}
          />
        )}
        {view === 'advertisers' && <AdvertisersView ads={ads} />}
      </main>

      {showAddAd && (
        <AddAdForm
          issues={issues}
          onAddAd={handleAddAd}
          onClose={() => setShowAddAd(false)}
        />
      )}
    </div>
  );
}

export default App;