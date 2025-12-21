import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { DEFAULT_COLORS, MUSIC_ICONS } from '../../utils/icons';
import { ChildFormHandles, NoteFormData } from '../../utils/types';
import FormField from '../common/FormField';

interface NoteFormProps {
  initialFormValues: NoteFormData;
  onSubmit: (data: NoteFormData) => void;
}

const NoteForm = forwardRef<ChildFormHandles, NoteFormProps>(
  ({
    initialFormValues,
    onSubmit,
  }, ref) => {
    const methods = useForm<NoteFormData>({ defaultValues: initialFormValues });

    const { register, handleSubmit, formState: { errors }, control, reset } = methods;

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(handleRHFSubmit)();
      }
    }));

    useEffect(() => {
      reset(initialFormValues);
    }, [reset, initialFormValues])

    const handleRHFSubmit: SubmitHandler<NoteFormData> = (data) => {
      const processedData: NoteFormData = { ...data };
      onSubmit(processedData);
    };

    return (
      <FormProvider {...methods}>
        <form name='edit-note-form' onSubmit={handleSubmit(handleRHFSubmit)} className='@container'>
          <div className='flex flex-col gap-4'>
            <FormField>
              <FormField.Label htmlFor='title'>Tiêu đề</FormField.Label>
              <FormField.Input
                id='title'
                placeholder='Ví dụ: A4'
                autoComplete='false'
                autoFocus
                {...register('title', { required: 'Tên note là bắt buộc', maxLength: 100 })}
              />
              <FormField.ErrorMessage message={errors.title?.message} />
            </FormField>

            <FormField>
              <FormField.Label htmlFor='description'>Mô tả</FormField.Label>
              <FormField.Textarea
                id='description'
                {...register('description', { maxLength: 500 })}
                placeholder='Mô tả note...'
              />
              <FormField.ErrorMessage message={errors.description?.message} />
            </FormField>

            <div className='grid @md:grid-cols-2 gap-3'>
              {/* <FormField>
              <FormField.Label htmlFor='track'>Track</FormField.Label>
              <FormField.Select
                id='track'
                {...register('track', { maxLength: 500 })}
                options={getValues('track')}
              />
              <FormField.ErrorMessage message={errors.description?.message} />
            </FormField> */}
              <div className='space-y-2'>
                <label htmlFor='track' className='block font-medium text-[#9da6b9]'>Track</label>
                <select
                  id='track'
                  {...register('trackId', { required: 'Vui lòng chọn Track' })}
                  className='w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer'
                >
                  {Object.values(initialFormValues.tracks).map(track => (
                    <option key={track.id} value={track.id}>
                      {track.label} (No: #{track.order || track.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className='space-y-2'>
                <label htmlFor='time' className='block font-medium text-[#9da6b9]'>Thời gian (giây)</label>
                <div className='flex items-center bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2'>
                  <span className='material-symbols-outlined text-[#58627a] mr-2'>timer</span>
                  <input
                    id='time'
                    className='w-full bg-transparent border-none p-0 text-white focus:ring-0'
                    type='number'
                    step='0.1'
                    {...register('time', {
                      required: 'Thời gian là bắt buộc',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Thời gian phải >= 0' },
                      max: { value: initialFormValues.maxTime, message: `Thời gian phải <= ${initialFormValues.maxTime}` }
                    })}
                  />
                </div>
                {errors.time && <p>{errors.time.message}</p>}
              </div>
            </div>

            <div className='space-y-3 pt-2'>
              <span className='block font-medium text-[#9da6b9]'>Màu sắc</span>
              <div className='flex gap-2 flex-wrap'>
                <Controller
                  name='color'
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
                                type='radio'
                                value={color}
                                className='appearance-none hidden'
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
                            className={`w-8 h-8 border-[${DEFAULT_COLORS.includes(field.value) ? '#3b4354' : field.value}] border-4 rounded-full bg-[#3b4354] flex items-center justify-center text-white hover:bg-[#4b5563]`}
                          >
                            <span className='material-symbols-outlined'>add</span>
                          </label>
                          <input
                            id='color-custom'
                            type='color'
                            {...register('color')}
                            className='hidden'
                          />
                        </div>
                      </>
                    )
                  }}
                />
              </div>
            </div>

            <div className='space-y-3 pt-2'>
              <span className='block font-medium text-[#9da6b9]'>Biểu tượng</span>
              <div className='grid grid-cols-5 @sm:grid-cols-10 gap-2'>
                <Controller
                  name='icon'
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
                                type='radio'
                                value={icon.key}
                                className='appearance-none hidden'
                              />
                              <label
                                htmlFor={`icon-${icon.key}`}
                                className={`aspect-square rounded ${activeClass} text-white flex items-center justify-center border border-transparent cursor-pointer`}
                                onClick={() => field.onChange(icon.key)}
                              >
                                <span className='material-symbols-outlined text-lg'>{icon.key}</span>
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
      </FormProvider>
    )
  }
);

export default NoteForm;
