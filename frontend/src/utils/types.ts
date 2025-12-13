export type SongTriggerAction = 'create' | 'update' | 'delete' | 'fetch' | 'set' | 'unset';

export interface ChildFormHandles {
  submitForm: () => void;
}