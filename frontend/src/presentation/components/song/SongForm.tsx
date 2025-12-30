import { forwardRef, useImperativeHandle } from 'react';
import { FormProvider, SubmitHandler, useController, useForm } from 'react-hook-form';
import { ChildFormHandles, SongFormData } from '../../utils/types';
import TracksSetting from './TracksSetting';
import FormField from '../common/FormField';
import { useTranslations } from 'next-intl';

interface SongFormProps {
  initialFormValues: SongFormData;
  onSubmit: (data: SongFormData) => void;
}

const SongForm = forwardRef<ChildFormHandles, SongFormProps>(
  ({ onSubmit, initialFormValues }, ref) => {
    const t = useTranslations('SongForm');
    const methods = useForm<SongFormData>({ defaultValues: initialFormValues });

    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = methods;

    const { field: tagsField } = useController({
      name: 'tags',
      control,
    });

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(handleRHFSubmit)();
      },
    }));

    const handleRHFSubmit: SubmitHandler<SongFormData> = data => {
      onSubmit(data);
    };

    return (
      <FormProvider {...methods}>
        <form name="edit-song-form" onSubmit={handleSubmit(handleRHFSubmit)} className="@container">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary !text-[20px]">info</span>
              <h3 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">
                {t('generalInfo')}
              </h3>
            </div>

            <FormField>
              <FormField.Label htmlFor="name">{t('nameLabel')}</FormField.Label>
              <FormField.Input
                id="name"
                placeholder={t('namePlaceholder')}
                autoComplete="false"
                autoFocus
                {...register('name', { required: t('nameRequired'), maxLength: 100 })}
              />
              <FormField.ErrorMessage message={errors.name?.message} />
            </FormField>

            <FormField>
              <FormField.Label htmlFor="desc">{t('descriptionLabel')}</FormField.Label>
              <FormField.Textarea
                id="desc"
                {...register('description', { maxLength: 500 })}
                placeholder={t('descriptionPlaceholder')}
              />
              <FormField.ErrorMessage message={errors.description?.message} />
            </FormField>

            <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
              <FormField>
                <FormField.Label htmlFor="totalDuration">{t('durationLabel')}</FormField.Label>
                <FormField.Number
                  id="totalDuration"
                  placeholder="3:00"
                  leftIcon="schedule"
                  {...register('totalDuration', {
                    required: t('durationRequired'),
                    min: { value: 1, message: t('durationMin') },
                    valueAsNumber: true,
                  })}
                />
                <FormField.ErrorMessage message={errors.totalDuration?.message} />
              </FormField>
              <FormField>
                <FormField.Label htmlFor="tags">{t('tagsLabel')}</FormField.Label>
                <FormField.Tags
                  id="tags"
                  placeholder={t('tagsPlaceholder')}
                  maxTags={10}
                  {...tagsField}
                />
                <FormField.ErrorMessage message={errors.tags?.message} />
              </FormField>
            </div>
          </div>

          <div className="h-px w-full bg-border mt-8 mb-8"></div>

          <TracksSetting register={register} control={control} />
        </form>
      </FormProvider>
    );
  },
);

SongForm.displayName = 'SongForm';

export default SongForm;
