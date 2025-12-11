import path from 'path';
import { DataSource } from 'typeorm';

const MIDIEditorDataSource = new DataSource({
  type: 'sqlite',
  database: 'db/midi-editor.sqlite',
  entities: [path.join(__dirname, '..', 'entities', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
  logging: false,
});

export default MIDIEditorDataSource;
