import React, { useState } from 'react';

function AddAdForm({ issues, onAddAd, onClose }) {
  const [form, setForm] = useState({
    company: '',
    soldBy: '',
    size: '',
    issues: [],
    adCopy: '',
    notes: '',
  });
  const [adCopyMode, setAdCopyMode] = useState('link');
  const [newIssueName, setNewIssueName] = useState('');
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [localIssues, setLocalIssues] = useState(issues);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIssueToggle = (issue) => {
    const already = form.issues.includes(issue);
    setForm({
      ...form,
      issues: already
        ? form.issues.filter(i => i !== issue)
        : [...form.issues, issue]
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, adCopy: file.name, adCopyFile: file });
  };

  const handleAddNewIssue = () => {
    if (newIssueName.trim() && !localIssues.includes(newIssueName.trim())) {
      const updated = [...localIssues, newIssueName.trim()];
      setLocalIssues(updated);
      setForm({ ...form, issues: [...form.issues, newIssueName.trim()] });
      setNewIssueName('');
      setShowNewIssue(false);
    }
  };

  const handleSubmit = () => {
    if (!form.company.trim()) {
      alert('Please enter a company name.');
      return;
    }
    if (form.issues.length === 0) {
      alert('Please select at least one issue.');
      return;
    }
    onAddAd({
      ...form,
      numIssues: form.issues.length,
      placed: {},
      id: Date.now(),
    }, localIssues);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Ad</h2>

        <label>Company / Advertiser</label>
        <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Tracksmith" />

        <label>Sold By</label>
        <input name="soldBy" value={form.soldBy} onChange={handleChange} placeholder="e.g. Jackson" />

        <label>Ad Size</label>
        <input name="size" value={form.size} onChange={handleChange} placeholder="e.g. Full page color" />

        <label>Issues</label>
        <div className="issue-checkboxes">
          {localIssues.map(issue => (
            <label key={issue} className="checkbox-label">
              <input
                type="checkbox"
                checked={form.issues.includes(issue)}
                onChange={() => handleIssueToggle(issue)}
              />
              {issue}
            </label>
          ))}
          <button className="new-issue-inline-btn" onClick={() => setShowNewIssue(!showNewIssue)}>
            + New Issue
          </button>
        </div>

        {showNewIssue && (
          <div className="inline-add-issue">
            <input
              type="text"
              placeholder="Issue name"
              value={newIssueName}
              onChange={e => setNewIssueName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddNewIssue()}
            />
            <button onClick={handleAddNewIssue}>Add</button>
          </div>
        )}

        <label>Ad Copy</label>
        <div className="ad-copy-toggle">
          <button
            className={adCopyMode === 'link' ? 'active' : ''}
            onClick={() => setAdCopyMode('link')}
          >
            Link
          </button>
          <button
            className={adCopyMode === 'file' ? 'active' : ''}
            onClick={() => setAdCopyMode('file')}
          >
            Upload PDF
          </button>
        </div>

        {adCopyMode === 'link' ? (
          <input
            name="adCopy"
            value={form.adCopy}
            onChange={handleChange}
            placeholder="https://drive.google.com/..."
          />
        ) : (
          <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
        )}

        <label>Notes</label>
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any notes..." />

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Add Ad</button>
        </div>
      </div>
    </div>
  );
}

export default AddAdForm;