import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Song } from '../../domain/entities/Song'; 
import { Track } from '../../domain/entities/Track';
import { errorStyle } from './SongForm.styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import TagsInput from '../common/TagsInput';
import { ChildFormHandles } from '../../utils/types';

interface SongSummaryFormData {
  id: string | undefined;
  name: string;
  description: string;
  totalDuration: number;
  tags: string[];
  tracks: Track[];
}

interface SongSummaryFormProps {
  initialSong: Song;
  onSubmit: (data: SongSummaryFormData) => void;
  onCancel?: () => void;
}

const SongForm = forwardRef<ChildFormHandles, SongSummaryFormProps>(
  ({ 
    onSubmit, 
    initialSong,  
  }, ref) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SongSummaryFormData>({
      defaultValues: initialSong,
    });
    
    useEffect(() => {
      reset(initialSong);
    }, [initialSong, reset]);

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(handleRHFSubmit)();
      }
    }));
    
    const handleRHFSubmit: SubmitHandler<SongSummaryFormData> = (data) => {
      const processedTags = data.tags?.filter(tag => tag.length > 0) || [];
      const finalData = {
          ...data,
          tags: processedTags,
      };
      onSubmit(finalData as any);
    };

    return (
      <form name='edit-song-summary-form' onSubmit={handleSubmit(handleRHFSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-[#1c1f27] to-[#111318] p-4 rounded-xl border border-[#282e39] shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-2xl">piano</span>
                </div>
                <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  Active
                </div>
              </div>
            <div className="relative z-10">
              <h4 className="text-white text-xl font-bold mb-1">{initialSong.name}</h4>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor='name' className="block font-medium text-[#9da6b9]">Name</label>
            <input
              id='name'
              className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#58627a]"
              type="text"
              autoComplete='false'
              {...register("name", { required: "Tên bài hát là bắt buộc", maxLength: 100 })}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>
          <div className="space-y-3">
            <label htmlFor='desc' className="block font-medium text-[#9da6b9]">Description</label>
            <textarea
              id='desc'
              className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#58627a] resize-none"
              rows={3}
              {...register("description", { maxLength: 500 })}
            />
            {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
          </div>
          <div className="space-y-3">
            <label htmlFor='time' className="block font-medium text-[#9da6b9]">Duration (second)</label>
            <input
              id='time'
              className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#58627a]"
              type="number"
              {...register("totalDuration", { 
                required: "Thời lượng là bắt buộc", 
                min: { value: 1, message: "Thời lượng phải lớn hơn 0" },
                valueAsNumber: true, 
              })}
              min="1"
              max="300"
            />
            {errors.totalDuration && <p style={errorStyle}>{errors.totalDuration.message}</p>}
          </div>
          <div className="space-y-3">
            <label htmlFor='tag-input' className="block font-medium text-[#9da6b9]">Tags</label>
            <TagsInput
              name="tags"
              control={control}
              placeholder="rock, drums, simple"
              maxTags={10}
            />
            {errors.totalDuration && <p style={errorStyle}>{errors.totalDuration.message}</p>}
          </div>
        </div>
      </form>
    );
  }
);

export default SongForm;
