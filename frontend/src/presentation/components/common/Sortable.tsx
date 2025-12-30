import {
  closestCorners,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Props } from '@dnd-kit/sortable/dist/components/SortableContext';
import React, { useMemo } from 'react';
import SortableItem from './SortableItem';

interface SortableProps {
  items: Props['items'];
  children: React.ReactElement | React.ReactElement[];
  onDragEnd: (event: DragEndEvent) => void;
  withWrapper?: (children: React.ReactElement) => React.ReactElement;
}

function Sortable({ items, onDragEnd, withWrapper, children }: SortableProps) {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = [mouseSensor, touchSensor];

  const wrapper = useMemo(() => {
    return withWrapper
      ? withWrapper
      : (children: React.ReactElement) => <React.Fragment>{children}</React.Fragment>;
  }, [withWrapper]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {wrapper(Array.isArray(children) ? <>{children}</> : children)}
      </SortableContext>
    </DndContext>
  );
}

Sortable.Item = SortableItem;

export default Sortable;
