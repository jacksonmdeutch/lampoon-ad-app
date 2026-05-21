import React, { useState, useEffect } from 'react';
import './App.css';
import IssuesView from './IssuesView';
import AdvertisersView from './AdvertisersView';
import AddAdForm from './AddAdForm';
import EditAdForm from './EditAdForm';
import ImportCSV from './ImportCSV';
import { db } from './firebase';
import Login from './Login';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

function App() {
  const [view, setView] = useState('issues');
  const [ads, setAds] = useState([]);
  const [issues, setIssues] = useState([]);
  const [printedIssues, setPrintedIssues] = useState([]);
  const [showAddAd, setShowAddAd] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load ads from Firebase in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'ads'), snapshot => {
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(loaded);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Load issues + printed status from Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'meta', 'issues'), snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setIssues(data.list || []);
        setPrintedIssues(data.printed || []);
      } else {
        // First time setup — seed with default issues
        setDoc(doc(db, 'meta', 'issues'), {
          list: ['Matt', 'Sterling', 'Destination', '150th', 'Commencement', 'Hamza'],
          printed: []
        });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleTogglePlaced = async (adId, issue) => {
    const ad = ads.find(a => a.id === adId);
    const newPlaced = { ...ad.placed, [issue]: !ad.placed[issue] };
    await updateDoc(doc(db, 'ads', adId), { placed: newPlaced });
  };

  const handleDeleteAd = async (adId) => {
    await deleteDoc(doc(db, 'ads', adId));
  };

  const handleAddIssue = async (name) => {
    if (!issues.includes(name)) {
      const newList = [...issues, name];
      await updateDoc(doc(db, 'meta', 'issues'), { list: newList });
    }
  };

  const handleAddAd = async (newAd, updatedIssues) => {
    const { id, ...adData } = newAd;
    await addDoc(collection(db, 'ads'), adData);
    if (updatedIssues) {
      const newIssues = updatedIssues.filter(i => !issues.includes(i));
      if (newIssues.length > 0) {
        await updateDoc(doc(db, 'meta', 'issues'), {
          list: [...issues, ...newIssues]
        });
      }
    }
  };

  const handleEditAd = async (updatedAd, updatedIssues) => {
    const { id, ...adData } = updatedAd;
    await updateDoc(doc(db, 'ads', id), adData);
    if (updatedIssues) {
      const newIssues = updatedIssues.filter(i => !issues.includes(i));
      if (newIssues.length > 0) {
        await updateDoc(doc(db, 'meta', 'issues'), {
          list: [...issues, ...newIssues]
        });
      }
    }
  };

  const handleToggleIssuePrinted = async (issue) => {
    const newPrinted = printedIssues.includes(issue)
      ? printedIssues.filter(i => i !== issue)
      : [...printedIssues, issue];
    await updateDoc(doc(db, 'meta', 'issues'), { printed: newPrinted });
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

  const handleImportAds = async (newAds) => {
    for (const ad of newAds) {
      await addDoc(collection(db, 'ads'), ad);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="app">
        <div className="loading">Loading Lampoon Ad Tracker...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Lampoon <span>Ad Tracker</span></h1>
        <span className="user-info">
  {user.email} · <button className="signout-btn" onClick={() => signOut(auth)}>Sign out</button>
</span>
        <div className="header-right">
          <button className="export-btn" onClick={handleExportCSV}>↓ Export CSV</button>
          <button className="export-btn" onClick={() => setShowImport(true)}>↑ Import CSV</button>
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
            onDeleteAd={handleDeleteAd}
          />
        )}
        {view === 'advertisers' && (
          <AdvertisersView
            ads={ads}
            issues={issues}
            onSelectIssue={handleSelectIssue}
            onEditAd={setEditingAd}
            onDeleteAd={handleDeleteAd}
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

{showImport && (
  <ImportCSV
    issues={issues}
    onImport={handleImportAds}
    onClose={() => setShowImport(false)}
  />
)}
    </div>
  );
}

export default App;