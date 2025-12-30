import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ChildFormHandles, NoteFormData } from '../../utils/types';
import FormField from '../common/FormField';
import { useTranslations } from 'next-intl';

interface NoteFormProps {
  initialFormValues: NoteFormData;
  onSubmit: (data: NoteFormData) => void;
}

const NoteForm = forwardRef<ChildFormHandles, NoteFormProps>(
  ({ initialFormValues, onSubmit }, ref) => {
    const t = useTranslations('NoteForm');
    const methods = useForm<NoteFormData>({ defaultValues: initialFormValues });

    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
      reset,
    } = methods;

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(handleRHFSubmit)();
      },
    }));

    useEffect(() => {
      reset(initialFormValues);
    }, [reset, initialFormValues]);

    const handleRHFSubmit: SubmitHandler<NoteFormData> = data => {
      const processedData: NoteFormData = { ...data };
      onSubmit(processedData);
    };

    return (
      <FormProvider {...methods}>
        <form name="edit-note-form" onSubmit={handleSubmit(handleRHFSubmit)} className="@container">
          <div className="flex flex-col gap-4">
            <FormField>
              <FormField.Label htmlFor="title">{t('titleLabel')}</FormField.Label>
              <FormField.Input
                id="title"
                placeholder={t('titlePlaceholder')}
                autoComplete="false"
                autoFocus
                {...register('title', { required: t('titleRequired'), maxLength: 100 })}
              />
              <FormField.ErrorMessage message={errors.title?.message} />
            </FormField>

            <FormField>
              <FormField.Label htmlFor="description">{t('descriptionLabel')}</FormField.Label>
              <FormField.Textarea
                id="description"
                {...register('description', { maxLength: 500 })}
                placeholder={t('descriptionPlaceholder')}
              />
              <FormField.ErrorMessage message={errors.description?.message} />
            </FormField>

            <div className="grid @md:grid-cols-2 gap-4">
              <FormField>
                <FormField.Label htmlFor="track">{t('trackLabel')}</FormField.Label>
                <FormField.Select
                  id="trackId"
                  {...register('trackId', { required: t('trackRequired') })}
                  options={Object.values(initialFormValues.tracks).map(track => ({
                    value: track.id,
                    label: `${track.label} (No: #${track.order || track.id})`,
                  }))}
                />
                <FormField.ErrorMessage message={errors.trackId?.message} />
              </FormField>

              <FormField>
                <FormField.Label htmlFor="time">{t('timeLabel')}</FormField.Label>
                <FormField.Number
                  id="time"
                  placeholder="50"
                  leftIcon="schedule"
                  {...register('time', {
                    required: t('timeRequired'),
                    valueAsNumber: true,
                    min: { value: 0, message: t('timeMin') },
                  })}
                />
                <FormField.ErrorMessage message={errors.time?.message} />
              </FormField>
            </div>

            <FormField>
              <FormField.Label htmlFor="color">{t('colorLabel')}</FormField.Label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => {
                  return <FormField.Color value={field.value} onChange={field.onChange} />;
                }}
              />
            </FormField>

            <FormField>
              <FormField.Label htmlFor="icon">{t('iconLabel')}</FormField.Label>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => {
                  return (
                    <div className="grid grid-cols-5 @sm:grid-cols-10 gap-2">
                      <FormField.MusicIcon value={field.value} onChange={field.onChange} />
                    </div>
                  );
                }}
              />
            </FormField>
          </div>
        </form>
      </FormProvider>
    );
  },
);

NoteForm.displayName = 'NoteForm';

export default NoteForm;
