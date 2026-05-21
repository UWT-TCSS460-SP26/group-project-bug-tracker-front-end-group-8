"use client";

import { useEffect, useRef, useState } from "react";

const ISSUES_ENDPOINT = "/api/issues";

const LIMITS = {
  title: 200,
  description: 5000,
  reproSteps: 5000,
};

const initialForm = {
  title: "",
  description: "",
  reproSteps: "",
  reporterEmail: "",
};

export default function ReportBugPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [submittedId, setSubmittedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState("dark");
  const successRef = useRef(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersLight =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    const initial = stored || (prefersLight ? "light" : "dark");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const clientValidate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    else if (form.title.length > LIMITS.title)
      next.title = `Title must be ${LIMITS.title} characters or fewer.`;

    if (!form.description.trim()) next.description = "Description is required.";
    else if (form.description.length > LIMITS.description)
      next.description = `Description must be ${LIMITS.description} characters or fewer.`;

    if (form.reproSteps && form.reproSteps.length > LIMITS.reproSteps)
      next.reproSteps = `Reproduction steps must be ${LIMITS.reproSteps} characters or fewer.`;

    if (form.reporterEmail && !/^\S+@\S+\.\S+$/.test(form.reporterEmail))
      next.reporterEmail = "Enter a valid email address.";

    return next;
  };

  const mapServerError = (message) => {
    const lower = (message || "").toLowerCase();
    if (lower.includes("title")) return { title: message };
    if (lower.includes("description")) return { description: message };
    if (lower.includes("repro")) return { reproSteps: message };
    if (lower.includes("email")) return { reporterEmail: message };
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSubmittedId(null);

    const v = clientValidate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
    };
    if (form.reproSteps.trim()) payload.reproSteps = form.reproSteps.trim();
    if (form.reporterEmail.trim()) payload.reporterEmail = form.reporterEmail.trim();

    setSubmitting(true);
    try {
      const res = await fetch(ISSUES_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const body = await res.json().catch(() => ({}));
        const id = body?.data?.id ?? null;
        setSubmittedId(id);
        setForm(initialForm);
        setTimeout(() => successRef.current?.focus(), 0);
        return;
      }

      const body = await res.json().catch(() => ({}));
      const message = body?.error || `Request failed with status ${res.status}.`;

      if (res.status === 400) {
        const mapped = mapServerError(message);
        if (mapped) setErrors(mapped);
        else setGlobalError(message);
        return;
      }

      setGlobalError(
        `Something went wrong on our end (HTTP ${res.status}). Your input is still here — try again in a moment.`
      );
    } catch (err) {
      setGlobalError(
        "Couldn't reach the server. Check your connection and try again — your text is preserved."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="topbar">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      <h1>Report a Bug</h1>
      <p className="subtitle">
        Tell us what broke. No login required — this report goes straight to the team.
      </p>

      {submittedId !== null && (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="alert alert-success"
        >
          <strong>Thanks!</strong> Your report was filed{submittedId ? ` as issue #${submittedId}` : ""}.
        </div>
      )}

      {globalError && (
        <div role="alert" className="alert alert-error">
          {globalError}
        </div>
      )}

      <form className="card" onSubmit={onSubmit} noValidate>
        <Field
          label="Title"
          name="title"
          required
          value={form.title}
          error={errors.title}
          onChange={onChange}
          maxLength={LIMITS.title}
          placeholder="Short summary of the bug"
        />

        <Field
          label="Description"
          name="description"
          required
          textarea
          value={form.description}
          error={errors.description}
          onChange={onChange}
          maxLength={LIMITS.description}
          placeholder="What happened? What did you expect?"
        />

        <Field
          label="Reproduction Steps"
          name="reproSteps"
          textarea
          value={form.reproSteps}
          error={errors.reproSteps}
          onChange={onChange}
          maxLength={LIMITS.reproSteps}
          placeholder="1. Go to ...  2. Click ...  3. See error"
          hint="Optional"
        />

        <Field
          label="Your Email"
          name="reporterEmail"
          type="email"
          value={form.reporterEmail}
          error={errors.reporterEmail}
          onChange={onChange}
          placeholder="you@example.com"
          hint="Optional — only used if we need to follow up"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Bug Report"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  required,
  textarea,
  type = "text",
  maxLength,
  placeholder,
  hint,
}) {
  const id = `f-${name}`;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  const commonProps = {
    id,
    name,
    value,
    onChange,
    maxLength,
    placeholder,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": describedBy,
    required: !!required,
  };
  return (
    <div className={`field${error ? " invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {textarea ? (
        <textarea rows={4} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
      {maxLength && (
        <span className={`char-counter${value.length >= maxLength * 0.9 ? " near-limit" : ""}`}>
          {value.length} / {maxLength}
        </span>
      )}
      {hint && !error && (
        <span id={`${id}-hint`} className="hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-err`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
