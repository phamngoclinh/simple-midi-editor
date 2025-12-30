import NoteEntity from '../../../domain/note/noteEntity';
import { createVisualizationBarTNN } from './VisualizationBarStrategy';

const VisualizationBar = ({
  notes,
  totalDuration,
}: {
  notes: NoteEntity[];
  totalDuration: number;
}) => {
  const timeNColors = notes.map(note => ({ time: note.time, color: note.color }));
  const htmlString = createVisualizationBarTNN(timeNColors, totalDuration);
  return <>{htmlString}</>;
};

export default VisualizationBar;
