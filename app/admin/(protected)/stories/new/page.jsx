// app/admin/(protected)/stories/new/page.jsx
// "New Story" — write a Tale from scratch, with no submission behind it.

import SubmissionEditor from '@/components/admin/SubmissionEditor';
import { saveDraftAction, publishAction } from '../../actions';

export default function NewStoryPage() {
  return (
    <SubmissionEditor
      mode="new"
      submission={null}
      existingStory={null}
      fixedStoryType="tale"
      onSaveDraft={saveDraftAction}
      onPublish={publishAction}
    />
  );
}