'use client';

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Control, useFieldArray, useFormContext, UseFormRegister } from 'react-hook-form';
import useModalAction from '../../hooks/store/useModalAction';
import { SongFormData } from '../../utils/types';
import FormField from '../common/FormField';
import Sortable from '../common/Sortable';
import useGenerateId from '../../hooks/useGenerateId';
import { useTranslations } from 'next-intl';

interface TracksSettingProps {
  register: UseFormRegister<SongFormData>;
  control: Control<SongFormData, any, SongFormData>;
}

const TracksSetting = ({ register, control }: TracksSettingProps) => {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<SongFormData>();
  const {
    fields: trackFields,
    append: addTrack,
    remove: removeTrack,
    move: moveTrack,
  } = useFieldArray({
    control,
    name: 'tracks',
  });
  const generateId = useGenerateId();
  const tTracks = useTranslations('Tracks');
  const tConfirmation = useTranslations('Confirmation');
  const tSongForm = useTranslations('SongForm');

  const { showConfirmation } = useModalAction();

  const trackIds = trackFields.map(trackField => trackField.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = trackIds.findIndex(id => id === active.id);
      const newIndex = trackIds.findIndex(id => id === over?.id);

      moveTrack(oldIndex, newIndex);

      const newFieldsOrder = arrayMove(trackFields, oldIndex, newIndex);
      newFieldsOrder.forEach((track, index) => {
        setValue(`tracks.${index}.order`, index + 1);
      });
    }
  };

  const handleRemoveTrack = async (index: number) => {
    const confirm = await showConfirmation({
      title: tConfirmation('deleteTrackTitle'),
      message: tTracks('deleteWarning'),
      confirmButtonLabel: tConfirmation('deleteSongAction'),
    });
    if (confirm) removeTrack(index);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary !text-[20px]">piano</span>
          <h3 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">
            {tSongForm('tracks')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
            {trackFields.length} Tracks
          </span>
          <span
            className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-foreground"
            title={tTracks('addTrack')}
            onClick={() =>
              addTrack({
                id: generateId('track'),
                songId: getValues('id'),
                order: trackFields.length + 1,
                label: 'Track ' + (trackFields.length + 1),
                instrument: 'Instrument ' + (trackFields.length + 1),
                notes: [],
              })
            }
          >
            add
          </span>
        </div>
      </div>

      <Sortable
        items={trackIds}
        onDragEnd={handleDragEnd}
        withWrapper={children => (
          <div className="grid grid-cols-1 @sm:grid-cols-2 gap-x-6 gap-y-4">{children}</div>
        )}
      >
        {trackFields.map((field, index) => (
          <Sortable.Item key={field.id} id={field.id}>
            <span className="text-text-subtle text-sm font-mono w-6">{index + 1}</span>
            <FormField>
              <FormField.Input
                placeholder="Track Label"
                {...register(`tracks.${index}.label`, { required: tSongForm('nameRequired') })}
              />
              <FormField.Hidden {...register(`tracks.${index}.order`)} />
              <FormField.ErrorMessage message={errors.tracks?.[index]?.label?.message} />
            </FormField>
            <span
              className="material-symbols-outlined text-red-400/80 text-sm cursor-pointer hover:text-red-600/50"
              title={tConfirmation('deleteTrackTitle')}
              onClick={() => handleRemoveTrack(index)}
            >
              delete
            </span>
          </Sortable.Item>
        ))}
      </Sortable>
    </div>
  );
};

export default TracksSetting;
