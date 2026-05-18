"use client";

import { useState } from 'react';

export default function BugReportPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reproSteps: '',
    reporterEmail: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear inline error if user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setGlobalError('');
    setFieldErrors({});

    const payload = {
      title: formData.title,
      description: formData.description,
    };
    if (formData.reproSteps && formData.reproSteps.trim() !== '') payload.reproSteps = formData.reproSteps;
    if (formData.reporterEmail && formData.reporterEmail.trim() !== '') payload.reporterEmail = formData.reporterEmail;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/v1/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', description: '', reproSteps: '', reporterEmail: '' });
      } else if (response.status === 400) {
        const data = await response.json().catch(() => ({}));
        const errStr = data.error || 'Validation failed. Please check your inputs.';
        setStatus('error');
        
        // Attempt to surface inline errors based on API message
        const lowerErr = errStr.toLowerCase();
        const newFieldErrors = {};
        let mapped = false;

        if (lowerErr.includes('title')) {
          newFieldErrors.title = errStr;
          mapped = true;
        } else if (lowerErr.includes('description')) {
          newFieldErrors.description = errStr;
          mapped = true;
        } else if (lowerErr.includes('email')) {
          newFieldErrors.reporterEmail = errStr;
          mapped = true;
        }

        if (mapped) {
          setFieldErrors(newFieldErrors);
        } else {
          setGlobalError(errStr);
        }
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus('error');
        setGlobalError(data.error || 'An unexpected error occurred on the server. Please try again later.');
      }
    } catch (error) {
      setStatus('error');
      setGlobalError('Failed to connect to the server. Your internet might be offline, or the API is currently unavailable. Please check your connection and try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ marginTop: 0, marginBottom: '20px' }}>File a Bug Report</h1>
      
      {status === 'success' && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '20px', borderRadius: '5px', border: '1px solid #c3e6cb' }}>
          <strong>Success!</strong> Your bug report has been successfully submitted. Thank you for your feedback.
        </div>
      )}

      {globalError && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '5px', border: '1px solid #f5c6cb' }}>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: fieldErrors.title ? '1px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }}
            disabled={status === 'submitting'}
            placeholder="Brief summary of the issue"
          />
          {fieldErrors.title && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{fieldErrors.title}</div>}
        </div>

        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={5000}
            rows={5}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: fieldErrors.description ? '1px solid #dc3545' : '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
            disabled={status === 'submitting'}
            placeholder="What happened? What were you trying to do?"
          />
          {fieldErrors.description && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{fieldErrors.description}</div>}
        </div>

        <div>
          <label htmlFor="reproSteps" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Reproduction Steps
          </label>
          <textarea
            id="reproSteps"
            name="reproSteps"
            value={formData.reproSteps}
            onChange={handleChange}
            maxLength={5000}
            rows={4}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
            disabled={status === 'submitting'}
            placeholder="Steps to reproduce the bug..."
          />
        </div>

        <div>
          <label htmlFor="reporterEmail" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Reporter Email
          </label>
          <input
            id="reporterEmail"
            type="email"
            name="reporterEmail"
            value={formData.reporterEmail}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: fieldErrors.reporterEmail ? '1px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }}
            disabled={status === 'submitting'}
            placeholder="your@email.com"
          />
          {fieldErrors.reporterEmail && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{fieldErrors.reporterEmail}</div>}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            padding: '12px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px',
            opacity: status === 'submitting' ? 0.7 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Bug Report'}
        </button>
      </form>
    </div>
  );
}