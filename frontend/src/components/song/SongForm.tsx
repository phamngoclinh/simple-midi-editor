import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Song } from '../../domain/entities/Song'; 
import { Track } from '../../domain/entities/Track';
import { errorStyle } from './SongForm.styles';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import TagsInput from '../common/TagsInput';
import { ChildFormHandles } from '../../utils/types';

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
  onCancel?: () => void;
  buttonLabel?: string;
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
    onCancel,
    initialSong,
    buttonLabel
  }, ref) => {
    
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SongFormData>({
      
      defaultValues: getDefaultFormData(initialSong),
    });

    const { fields: trackFields } = useFieldArray({
      control,
      name: 'tracks'
    });

    
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

    return (
      <form name='edit-song-form' onSubmit={handleSubmit(handleRHFSubmit)}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-white text-base font-medium leading-normal">Tổng thời lượng (phút)</span>
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
            <span
              className="text-xs font-medium text-text-subtle bg-surface-input px-2 py-1 rounded border border-border-dark">{trackFields.length} Tracks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {trackFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <span className="text-text-subtle text-sm font-mono w-6">{index + 1}</span>
                <input
                  className="form-input flex-1 rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-border-dark bg-surface-input focus:border-primary h-10 px-3 text-sm font-normal"
                  placeholder="Track Label"
                  {...register(`tracks.${index}.label`, { required: "Nhãn Track là bắt buộc" })}
                />
                <span className="material-symbols-outlined text-text-subtle !text-[18px]">drag_indicator</span>
              </div>
            ))}
            {errors.tracks?.message && <p style={errorStyle}>{errors.tracks.message}</p>}
          </div>
        </div>
      </form>
    );
  }
)

export default SongForm;
