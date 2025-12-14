export type SongTriggerAction = 'create' | 'update' | 'delete' | 'fetch' | 'set' | 'unset';

export type NoteTriggerAction = 'create' | 'update' | 'delete';

export interface ChildFormHandles {
  submitForm: () => void;
}