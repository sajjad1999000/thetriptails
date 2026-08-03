"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { submitStory } from "@/lib/actions/submitStory";
import styles from "./SubmitForm.module.css";

// NOTE: useActionState is React 19 / Next.js 15+. If this project is on
// Next 14 / React 18, swap this import for:
//   import { useFormState as useActionState } from "react-dom";
// same call signature, drop-in.

const initialState = { status: "idle", message: "", errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="sun" type="submit" className={styles.submitBtn} disabled={pending}>
      {pending ? "Sending…" : "Send my story — free"}
    </Button>
  );
}

export default function SubmitForm() {
  const [state, formAction] = useActionState(submitStory, initialState);

  if (state.status === "success") {
    return (
      <div className={styles.form} role="status">
        <h3 className={styles.heading}>Got it — thank you.</h3>
        <span className={styles.hand}>we read every single one ✍</span>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} action={formAction} noValidate encType="multipart/form-data">
      <h3 className={styles.heading}>Start your tale</h3>
      <span className={styles.hand}>we read every single one ✍</span>

      {/* Honeypot — hidden from real visitors via CSS, left for bots that
          fill in every field they can find. Must stay empty. */}
      <div className={styles.hpField} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p className={styles.formAlert} role="alert">
          {state.message}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" autoComplete="name" placeholder="Sara Khan" required />
        {state.errors?.name && <small className={styles.fieldError}>{state.errors.name}</small>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
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
        <label htmlFor="location">Where did it happen?</label>
        <input id="location" name="location" type="text" placeholder="Hunza, Pakistan" required />
        {state.errors?.location && <small className={styles.fieldError}>{state.errors.location}</small>}
      </div>

      <div className={styles.field}>
        <label htmlFor="country">Country you write from (optional)</label>
        <input id="country" name="country" type="text" placeholder="Pakistan" />
      </div>

      <div className={styles.field}>
        <label htmlFor="title">Give it a title (optional)</label>
        <input id="title" name="title" type="text" placeholder="The bus that never came" />
      </div>

      <div className={styles.field}>
        <label htmlFor="story">Your tale</label>
        <textarea id="story" name="story" placeholder="It started when our bus broke down outside..." required />
        {state.errors?.story && <small className={styles.fieldError}>{state.errors.story}</small>}
      </div>

      <div className={styles.field}>
        <label htmlFor="photos">Add a photo or two (optional)</label>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className={styles.fileInput}
        />
        <small className={styles.fileHint}>JPEG, PNG, or WebP · up to 5MB each</small>
        {state.errors?.photos && <small className={styles.fieldError}>{state.errors.photos}</small>}
      </div>

      <SubmitButton />
      <small className={styles.fine}>No account needed · You keep full ownership of your story</small>
    </form>
  );
}