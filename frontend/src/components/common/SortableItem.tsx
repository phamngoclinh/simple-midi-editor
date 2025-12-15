import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';

interface SortableItemProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  indicator?: boolean;
  [key: string]: any;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children, indicator = true, className, ...other }) => {
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
    <div ref={setNodeRef} {...other} style={style} className={`flex items-center gap-3 ${className}`} {...(!indicator ? {...listeners, ...attributes}: {})}>
      {children}
      {indicator && <span {...listeners} {...attributes} className="material-symbols-outlined text-text-subtle !text-[18px]">drag_indicator</span>}
    </div>
  );
};

export default SortableItem;