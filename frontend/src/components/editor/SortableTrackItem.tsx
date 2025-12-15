import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableTrackItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableTrackItem: React.FC<SortableTrackItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3">
      {children}
      <span {...listeners} {...attributes} className="material-symbols-outlined text-text-subtle !text-[18px]">drag_indicator</span>
    </div>
  );
};

export default SortableTrackItem;