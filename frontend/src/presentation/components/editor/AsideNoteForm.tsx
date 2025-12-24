import { useMemo, useRef } from 'react';
import useDeleteNote from '../../hooks/note/useDeleteNote';
import { useNoteFormInitializer } from '../../hooks/note/useNoteFormInitializer';
import useUpdateNote from '../../hooks/note/useUpdateNote';
import { ChildFormHandles } from '../../utils/types';
import Aside from '../common/Aside';
import NoteForm from '../note/NoteForm';
import { PrimaryButton, SecondaryButton } from '../common/Button';

interface AsideNoteFormProps {
  noteId: string;
  onCancel: () => void;
}

const AsideNoteForm = ({ noteId, onCancel }: AsideNoteFormProps) => {
  const formRef = useRef<ChildFormHandles>(null);
  const { initializeUpdateForm } = useNoteFormInitializer();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();
  
  const handleDelete = async (noteId: string) => {
    const response = await deleteNote(noteId);
    if (response.success) onCancel();
  }

  const noteFormData = useMemo(() => {
    return initializeUpdateForm(noteId);
  }, [noteId, initializeUpdateForm])

  return (
    <Aside
      title='Edit note'
      subTitle='Edit note details'
      actions={[
        <SecondaryButton
          className='flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10'
          onClick={() => handleDelete(noteId)}
        >
          <span className='material-symbols-outlined text-lg mr-2'>delete</span> Delete
        </SecondaryButton>,
        <PrimaryButton
          type='submit'
          className='flex-1'
          onClick={() => formRef.current?.submitForm()}
        >
          <span className='material-symbols-outlined text-lg mr-2'>save</span> Save
        </PrimaryButton>,
      ]}
    >
      <>
        <div className='flex items-center transition-colors font-medium text-white cursor-pointer' onClick={onCancel}>
          <span className='material-symbols-outlined text-lg mr-2'>arrow_back</span>
          Quay lại
        </div>
        {noteFormData
          ? <NoteForm
              initialFormValues={noteFormData}
              onSubmit={updateNote}
              ref={formRef}
            />
          : <>Đang khởi tạo form</>}
      </>
    </Aside>
  )
}

export default AsideNoteForm;