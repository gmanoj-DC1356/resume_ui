import { Button } from '@/components/common/Button';
import { TextInput } from '@/components/common/TextInput';
import { useDeleteSession, useRenameSession } from '@/hooks/useSessions';
import type { HistoryEntry } from '@/types/domain';
import { useState, type FormEvent } from 'react';

const MAX_TITLE_LENGTH = 200;

interface HistoryItemProps {
  entry: HistoryEntry;
  selected: boolean;
  // Opens the matches saved for this entry; rejects if they cannot be loaded.
  onOpen: (id: string) => Promise<void>;
}

const TYPE_LABELS: Record<HistoryEntry['type'], string> = {
  match: 'Match',
  questions: 'Questions',
};

export function HistoryItem({ entry, selected, onOpen }: Readonly<HistoryItemProps>) {
  const rename = useRenameSession();
  const remove = useDeleteSession();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(entry.title);
  const busy = rename.isPending || remove.isPending;
  const [openFailed, setOpenFailed] = useState(false);
  const failed = rename.isError || remove.isError;

  const startEdit = () => {
    setDraft(entry.title);
    rename.reset();
    setEditing(true);
  };

  const open = () => {
    setOpenFailed(false);
    onOpen(entry.id).catch(() => setOpenFailed(true));
  };

  const saveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    if (title === entry.title) {
      setEditing(false);
      return;
    }
    rename.mutate({ id: entry.id, title }, { onSuccess: () => setEditing(false) });
  };

  return (
    <div
      className={`relative rounded-lg border p-3 text-sm transition-colors hover:bg-brand-primary-soft focus-within:bg-brand-primary-soft ${
        selected ? 'border-brand-secondary bg-brand-primary-soft ring-1 ring-brand-secondary' : 'border-brand-line bg-white'
      }`}
    >
      {editing ? (
        <form onSubmit={saveEdit} className="relative z-10 space-y-2">
          <TextInput
            aria-label="Session title"
            value={draft}
            maxLength={MAX_TITLE_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={busy || draft.trim() === ''}>
              Save
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={open}
          aria-current={selected ? 'true' : undefined}
          title="Open these matches"
          className="block w-full cursor-pointer text-left font-medium text-brand-text after:absolute after:inset-0 after:content-['']"
        >
          {entry.title}
        </button>
      )}
      <div className="mt-1 flex items-center justify-between text-xs text-brand-muted">
        <span className="rounded-full bg-brand-secondary-soft px-2 py-0.5 text-brand-secondary">
          {TYPE_LABELS[entry.type]}
        </span>
        <span>{entry.createdAt}</span>
      </div>
      {!editing && (
        <div className="relative z-10 mt-2 flex items-center gap-2">
          {confirmingDelete ? (
            <>
              <span className="text-xs text-brand-muted">Delete this session?</span>
              <Button size="sm" variant="danger" disabled={busy} onClick={() => remove.mutate(entry.id)}>
                Delete
              </Button>
              <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirmingDelete(false)}>
                Keep
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="secondary" aria-label={`Edit ${entry.title}`} onClick={startEdit}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                aria-label={`Delete ${entry.title}`}
                onClick={() => setConfirmingDelete(true)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      )}
      {openFailed && (
        <p role="alert" className="mt-2 text-xs text-brand-bad">
          The saved matches could not be loaded. Please try again.
        </p>
      )}
      {failed && (
        <p role="alert" className="mt-2 text-xs text-brand-bad">
          That change could not be saved. Please try again.
        </p>
      )}
    </div>
  );
}
