"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { submitLocalsNote } from "@/lib/actions/submitLocalsNote";
import styles from "./SubmitForm.module.css";

// NOTE: useActionState is React 19 / Next.js 15+. If this project is on
// Next 14 / React 18, swap this import for:
//   import { useFormState as useActionState } from "react-dom";
// same call signature, drop-in. (Same note as SubmitForm.jsx.)

const initialState = { status: "idle", message: "", errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="sun" type="submit" className={styles.submitBtn} disabled={pending}>
      {pending ? "Sending…" : "Send my tip — free"}
    </Button>
  );
}

export default function LocalsNoteSubmitForm() {
  const [state, formAction] = useActionState(submitLocalsNote, initialState);

  if (state.status === "success") {
    return (
      <div className={styles.form} role="status">
        <h3 className={styles.heading}>Got it — thank you.</h3>
        <span className={styles.hand}>real tips, from real locals ✍</span>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} action={formAction} noValidate encType="multipart/form-data">
      <h3 className={styles.heading}>Share a local&rsquo;s tip</h3>
      <span className={styles.hand}>real tips, from real locals ✍</span>

      {/* Honeypot — same pattern as SubmitForm.jsx, hidden via CSS. */}
      <div className={styles.hpField} aria-hidden="true">
        <label htmlFor="ln-company">Company</label>
        <input id="ln-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p className={styles.formAlert} role="alert">
          {state.message}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="ln-name">Your name</label>
        <input id="ln-name" name="name" type="text" autoComplete="name" placeholder="Sara Khan" required />
        {state.errors?.name && <small className={styles.fieldError}>{state.errors.name}</small>}
      </div>

      <div className={styles.field}>
        <label htmlFor="ln-email">Email</label>
        <input
          id="ln-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
        />
        {state.errors?.email && <small className={styles.fieldError}>{state.errors.email}</small>}
      </div>

      <div className={styles.field}>
        <label htmlFor="ln-location">Which place is this tip about?</label>
        <input id="ln-location" name="location" type="text" placeholder="Chiang Mai, Thailand" required />
        {state.errors?.location && <small className={styles.fieldError}>{state.errors.location}</small>}
      </div>

      <div className={styles.field}>
        <label htmlFor="ln-country">Country you write from (optional)</label>
        <input id="ln-country" name="country" type="text" placeholder="Thailand" />
      </div>

      <div className={styles.field}>
        <label htmlFor="ln-title">Give it a short title (optional)</label>
        <input id="ln-title" name="title" type="text" placeholder="Skip the Sunday market crowds" />
      </div>

      <div className={styles.field}>
        <label htmlFor="ln-story">Your tip</label>
        <textarea
          id="ln-story"
          name="story"
          placeholder="What should a visitor actually know?"
          required
          rows={4}
        />
        {state.errors?.story && <small className={styles.fieldError}>{state.errors.story}</small>}
      </div>

      <div className={styles.field}>
        <label htmlFor="ln-photos">Add a photo (optional)</label>
        <input
          id="ln-photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className={styles.fileInput}
        />
        <small className={styles.fileHint}>JPEG, PNG, or WebP · up to 5MB, max 2 photos</small>
        {state.errors?.photos && <small className={styles.fieldError}>{state.errors.photos}</small>}
      </div>

      <SubmitButton />
      <small className={styles.fine}>
        No account needed · Real name, real place, no invented &ldquo;local&rdquo; voices
      </small>
    </form>
  );
}