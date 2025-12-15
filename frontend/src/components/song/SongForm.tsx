import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useModal } from '../../contexts/ModalContext';
import { Song } from '../../domain/entities/Song';
import { Track } from '../../domain/entities/Track';
import { ChildFormHandles } from '../../utils/types';
import Sortable from '../common/Sortable';
import TagsInput from '../common/TagsInput';
import { errorStyle } from './SongForm.styles';

interface SongFormData {
  id: string | undefined;
  name: string;
  description: string;
  totalDuration: number;
  tracks: Track[]; 
  tags: string[];
}

interface SongFormProps {
  initialSong?: Song;
  onSubmit: (data: SongFormData) => void;
}

const getDefaultFormData = (song?: Song): SongFormData => {
  let tracks: Track[] = [];

  if (song && song.tracks.length > 0) {
    tracks = song.tracks.map((t, index) => ({
      id: t.id,
      label: t.label,
      order: t.order ?? (index + 1), 
      instrument: t.instrument,
      songId: t.songId,
      notes: t.notes
    })).sort((a, b) => a.order - b.order); 
  } else {
    tracks = [
      { id: '1', label: 'Track 1', order: 1, instrument: 'Instrument 1', notes: [] },
      { id: '2', label: 'Track 2', order: 2, instrument: 'Instrument 2', notes: [] },
      { id: '3', label: 'Track 3', order: 3, instrument: 'Instrument 3', notes: [] },
      { id: '4', label: 'Track 4', order: 4, instrument: 'Instrument 4', notes: [] },
      { id: '5', label: 'Track 5', order: 5, instrument: 'Instrument 5', notes: [] },
      { id: '6', label: 'Track 6', order: 6, instrument: 'Instrument 6', notes: [] },
      { id: '7', label: 'Track 7', order: 7, instrument: 'Instrument 7', notes: [] },
      { id: '8', label: 'Track 8', order: 8, instrument: 'Instrument 8', notes: [] },
    ];
  }

  return {
    id: song?.id || undefined,
    name: song?.name || '',
    description: song?.description || '',
    totalDuration: song?.totalDuration || 100,
    tags: song?.tags || [],
    tracks: tracks,
  }
};

const SongForm = forwardRef<ChildFormHandles, SongFormProps>(
  ({
    onSubmit,
    initialSong,
  }, ref) => {
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<SongFormData>({
      defaultValues: getDefaultFormData(initialSong),
    });

    const { fields: trackFields, move, append, remove } = useFieldArray({
      control,
      name: 'tracks'
    });

    const items = trackFields.map(trackField => trackField.id);

    const { showConfirmation } = useModal();

    useEffect(() => {
      reset(getDefaultFormData(initialSong));
    }, [initialSong, reset]);

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(handleRHFSubmit)(); 
      }
    }));

    const handleRHFSubmit: SubmitHandler<SongFormData> = (data) => {
      const processedTags = data.tags.filter(tag => tag.length > 0);
      const processedTracks = data.tracks.sort((a, b) => a.order - b.order);

      const finalData = {
        ...data,
        tags: processedTags, 
        tracks: processedTracks,
        
      };

      onSubmit(finalData as any);
    };

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = items.findIndex((id) => id === active.id);
        const newIndex = items.findIndex((id) => id === over?.id);

        move(oldIndex, newIndex);

        const newFieldsOrder = arrayMove(trackFields, oldIndex, newIndex);
        newFieldsOrder.forEach((track, index) => {
          setValue(`tracks.${index}.order`, index + 1);
        });
      }
    };

    const handleRemoveTrack = async (index: number) => {
      const confirm = await showConfirmation({
        message: 'Xoá track sẽ xoá tất cả các notes liên quan. Hành động này không thể thu hồi sau khi lưu!'
      })
      if (confirm) remove(index)
    }

    return (
      <form name='edit-song-form' onSubmit={handleSubmit(handleRHFSubmit)} className='@container'>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary !text-[20px]">info</span>
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Thông tin chung</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor='name' className="text-white text-base font-medium leading-normal">Tên bài hát</label>
            <input
              id='name'
              className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary h-12 placeholder:text-text-subtle px-4 text-base font-normal transition-all"
              placeholder="Ví dụ: Giai điệu mùa hè"
              autoComplete='false'
              autoFocus
              {...register("name", { required: "Tên bài hát là bắt buộc", maxLength: 100 })}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor='desc' className="text-white text-base font-medium leading-normal">Mô tả</label>
            <textarea
              id='desc'
              {...register("description", { maxLength: 500 })}
              className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary min-h-[100px] placeholder:text-text-subtle p-4 text-base font-normal transition-all"
              placeholder="Ghi chú về nhịp điệu, cảm xúc..."></textarea>
            {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-white text-base font-medium leading-normal">Tổng thời lượng (giây)</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-text-subtle !text-[20px]">schedule</span>
                <input
                  type='number'
                  className="form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary h-12 placeholder:text-text-subtle px-4 pl-10 text-base font-normal transition-all"
                  placeholder="3:00"
                  {...register("totalDuration", {
                    required: "Thời lượng là bắt buộc",
                    min: { value: 1, message: "Thời lượng phải lớn hơn 0" },
                    valueAsNumber: true, 
                  })}
                />
                {errors.totalDuration && <p style={errorStyle}>{errors.totalDuration.message}</p>}

              </div>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-white text-base font-medium leading-normal">Thẻ (Tags)</span>
              <div className="relative">
                <TagsInput
                  name="tags"
                  control={control}
                  placeholder="rock, drums, simple"
                  maxTags={10}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="h-px w-full bg-border-dark/50 mt-8 mb-8"></div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary !text-[20px]">piano</span>
              <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cấu hình Track</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-subtle bg-surface-input px-2 py-1 rounded border border-border-dark">{trackFields.length} Tracks</span>
              <span
                className="material-symbols-outlined text-primary text-text-subtle cursor-pointer hover:text-white"
                title="Thêm track"
                onClick={() => append({
                  songId: initialSong?.id,
                  order: trackFields.length + 1,
                  label: 'New label',
                  instrument: '',
                  notes: []
                })}
              >add</span>
            </div>
          </div>

          <Sortable
            items={items}
            onDragEnd={handleDragEnd}
            withWrapper={(children) => (<div className='grid grid-cols-1 @sm:grid-cols-2 gap-x-6 gap-y-4'>{children}</div>)}
          >
            {trackFields.map((field, index) => (
              <Sortable.Item 
                key={field.id} 
                id={field.id}
              >
                <span className="text-text-subtle text-sm font-mono w-6">{index + 1}</span>
                <input
                  className="form-input flex-1 rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-border-dark bg-surface-input focus:border-primary h-10 px-3 font-normal"
                  placeholder="Track Label"
                  {...register(`tracks.${index}.label`, { required: "Nhãn Track là bắt buộc" })}
                />
                <input type="hidden" {...register(`tracks.${index}.order`)} />
                <span
                  className="material-symbols-outlined text-red-400/50 text-sm cursor-pointer hover:text-red-600/50"
                  title="Xoá track"
                  onClick={() => handleRemoveTrack(index)}
                >delete</span>
                {/* {errors.tracks?.[index]?.label?.message && <p style={errorStyle}>{errors.tracks?.[index]?.label?.message}</p>} */}
              </Sortable.Item>
            ))}
          </Sortable>
        </div>
      </form>
    );
  }
)

export default SongForm;
