'use client';

import { useMemo, useRef } from 'react';
import useDeleteNote from '../../hooks/note/useDeleteNote';
import { useNoteFormInitializer } from '../../hooks/note/useNoteFormInitializer';
import useUpdateNote from '../../hooks/note/useUpdateNote';
import { ChildFormHandles } from '../../utils/types';
import Aside from '../common/Aside';
import NoteForm from '../note/NoteForm';
import { PrimaryButton, SecondaryButton } from '../common/Button';
import { useTranslations } from 'next-intl';

interface AsideNoteFormProps {
  noteId: string;
  onCancel: () => void;
}

const AsideNoteForm = ({ noteId, onCancel }: AsideNoteFormProps) => {
  const formRef = useRef<ChildFormHandles>(null);
  const { initializeUpdateForm } = useNoteFormInitializer();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();
  const t = useTranslations('Editor');

  const handleDelete = async (noteId: string) => {
    const response = await deleteNote(noteId);
    if (response.success) onCancel();
  };

  const noteFormData = useMemo(() => {
    return initializeUpdateForm(noteId);
  }, [noteId, initializeUpdateForm]);

  return (
    <Aside
      title={t('editNote')}
      subTitle={t('editNoteDetails')}
      actions={[
        <SecondaryButton
          key="delete"
          className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
          onClick={() => handleDelete(noteId)}
        >
          <span className="material-symbols-outlined text-lg mr-2">delete</span> {t('delete')}
        </SecondaryButton>,
        <PrimaryButton
          key="save"
          type="submit"
          className="flex-1"
          onClick={() => formRef.current?.submitForm()}
        >
          <span className="material-symbols-outlined text-lg mr-2">save</span> {t('save')}
        </PrimaryButton>,
      ]}
    >
      <>
        <div
          className="flex items-center transition-colors font-medium text-foreground cursor-pointer"
          onClick={onCancel}
        >
          <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
          {t('back')}
        </div>
        {noteFormData ? (
          <NoteForm initialFormValues={noteFormData} onSubmit={updateNote} ref={formRef} />
        ) : (
          <>{t('initializingForm')}</>
        )}
      </>
    </Aside>
  );
};

export default AsideNoteForm;
