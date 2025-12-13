import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Song } from '../../domain/entities/Song';
import { DEFAULT_COLORS, MUSIC_ICONS } from '../../utils/icons';
import { ChildFormHandles } from '../../utils/types';
import { errorStyle } from './NoteEditForm.styles';

export interface NoteFormData {
  id?: string;
  songId: string;
  trackId: string;
  track: number;
  time: number;
  title: string;
  description: string;
  color: string;
  icon?: string;
}

interface NoteEditFormProps {
  currentSong: Song;
  initialNote: NoteFormData | null;
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  buttonLabel?: string;
}

const getDefaultNoteFormData = (song: Song, initialNote: NoteFormData | null): NoteFormData => {
  return initialNote || {
    songId: song.id || '',
    trackId: song.tracks[0]?.id || '',
    track: 1,
    time: 0,
    title: '',
    description: '',
    color: '#007bff',
    icon: 'none'
  };
};

const NoteEditForm = forwardRef<ChildFormHandles, NoteEditFormProps>(
  ({
    currentSong,
    initialNote,
    onSubmit,
  }, ref) => {
    const { tracks, totalDuration } = currentSong;

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<NoteFormData>({
      defaultValues: getDefaultNoteFormData(currentSong, initialNote),
    });

    useEffect(() => {
      reset(getDefaultNoteFormData(currentSong, initialNote));
    }, [currentSong, initialNote, reset]);

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(handleRHFSubmit)(); 
      }
    }));

    const handleRHFSubmit: SubmitHandler<NoteFormData> = (data) => {
      const processedData: NoteFormData = { ...data };

      processedData.track = currentSong.tracks.findIndex(x => x.id === processedData.trackId) + 1;

      onSubmit(processedData);
    };

    return (
      <form name='edit-note-form' onSubmit={handleSubmit(handleRHFSubmit)} className='@container'>
        <div className="flex flex-col gap-4">
          <div className="space-y-3">
            <label htmlFor='title' className="block text-sm font-medium text-[#9da6b9]">Title</label>
            <input
              id='title'
              className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#58627a] text-sm"
              type="text"
              {...register("title", { required: "Tên note là bắt buộc", maxLength: 100 })}
            />
            {errors.title && <p style={errorStyle}>{errors.title.message}</p>}
          </div>
          <div className="space-y-3">
            <label htmlFor='desc' className="block text-sm font-medium text-[#9da6b9]">Description</label>
            <textarea
              id='desc'
              className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#58627a] text-sm resize-none"
              rows={3}
              {...register("description", { maxLength: 500 })}
            />
            {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor='track' className="block text-sm font-medium text-[#9da6b9]">Track</label>
              <select
                id='track'
                {...register("trackId", { required: "Vui lòng chọn Track" })}
                className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary text-sm appearance-none cursor-pointer"
              >
                {tracks.map(track => (
                  <option key={track.id} value={track.id as string}>
                    {track.label} (No: #{track.order || track.id})
                  </option>
                ))}
              </select>
              {errors.trackId && <p style={errorStyle}>{errors.trackId.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor='time' className="block text-sm font-medium text-[#9da6b9]">Time (s)</label>
              <div className="flex items-center bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-[#58627a] text-sm mr-2">timer</span>
                <input
                  id='time'
                  className="w-full bg-transparent border-none p-0 text-white focus:ring-0 text-sm"
                  type="number"
                  {...register("time", {
                    required: "Thời gian là bắt buộc",
                    valueAsNumber: true,
                    min: { value: 0, message: "Thời gian phải >= 0" },
                    max: { value: totalDuration, message: `Thời gian phải <= ${totalDuration}` }
                  })}
                />
                {errors.time && <p style={errorStyle}>{errors.time.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="block text-sm font-medium text-[#9da6b9]">Note Color</span>
            <div className="flex gap-2 flex-wrap">
              <Controller
                name="color"
                control={control}
                render={({ field }) => {
                  
                  return (
                    <>
                      {DEFAULT_COLORS.map((color, index) => {
                        const activeClass = color === field.value ? 'ring-2 ring-offset-2 ring-offset-[#111318]' : '';
                        return (
                          <div key={`color-${index}`}>
                            <input
                              id={`color-${color}`}
                              type="radio"
                              value={color}
                              className="appearance-none hidden"
                            />
                            <label
                              htmlFor={`color-${color}`}
                              className={`block w-8 h-8 rounded-full bg-[${color}] ${activeClass} hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#111318] transition-all`}
                              onClick={() => field.onChange(color)}
                            >
                            </label>
                          </div>
                        )
                      })}

                      <div className='relative'>
                        <label
                          htmlFor='color-custom'
                          className={`w-8 h-8 border-[${DEFAULT_COLORS.includes(field.value) ? '#3b4354': field.value}] border-4 rounded-full bg-[#3b4354] flex items-center justify-center text-white hover:bg-[#4b5563]`}
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </label>
                        <input
                          id='color-custom'
                          type="color"
                          {...register("color")}
                          className='hidden'
                        />
                      </div>
                    </>
                  )
                }}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="block text-sm font-medium text-[#9da6b9]">Icon</span>
            <div className="grid grid-cols-5 @sm:grid-cols-10 gap-2">
              <Controller
                name="icon"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      {MUSIC_ICONS.map(icon => {
                        const activeClass = icon.key === field.value ? 'bg-primary' : 'bg-[#1c1f27]';
                        return (
                          <div key={`icon-${icon.key}`}>
                            <input
                              id={`icon-${icon.key}`}
                              type="radio"
                              value={icon.key}
                              className="appearance-none hidden"
                            />
                            <label
                              htmlFor={`icon-${icon.key}`}
                              className={`aspect-square rounded ${activeClass} text-white flex items-center justify-center border border-transparent cursor-pointer`}
                              onClick={() => field.onChange(icon.key)}
                            >
                              <span className="material-symbols-outlined text-lg">{icon.key}</span>
                            </label>
                          </div>
                        )
                      })}
                    </>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </form>
    )
  }
);

export default NoteEditForm;
