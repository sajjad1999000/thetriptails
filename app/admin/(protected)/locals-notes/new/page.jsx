// app/admin/(protected)/locals-notes/new/page.jsx
// "New Locals' Note" — write one from scratch, no submission behind it.

import SubmissionEditor from '@/components/admin/SubmissionEditor';
import { saveDraftAction, publishAction } from '../../actions';

export default function NewLocalsNotePage() {
  return (
    <SubmissionEditor
      mode="new"
      submission={null}
      existingStory={null}
      fixedStoryType="locals_note"
      onSaveDraft={saveDraftAction}
      onPublish={publishAction}
    />
  );
}