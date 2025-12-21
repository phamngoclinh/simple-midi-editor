import React, { forwardRef } from 'react';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function FormField({ children, ...others }: FormFieldProps) {
  return <div className='flex flex-col gap-2 w-full' {...others}>
    {children}
  </div>
};

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return <label className='text-white text-base font-medium leading-normal' {...props} />
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ leftIcon, rightIcon, ...others }, ref) => {
  return (
    <div className='relative w-full'>
      {leftIcon && (
        <span className='material-symbols-outlined absolute left-3 top-3 text-text-subtle !text-[20px]'>
          {leftIcon}
        </span>
      )}
      <input
        className={`form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary h-11 px-3 font-normal
          ${leftIcon ? 'pl-10' : ''}
          ${rightIcon ? 'pr-10' : ''}
        `}
        ref={ref}
        {...others}
      />
      {rightIcon && (
        <div className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'>
          {rightIcon}
        </div>
      )}
    </div>
  )
});

const Number = (props: InputProps) => {
  return <Input {...props} type='number' />
}

interface TagsInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  maxTags?: number;
  onChange: (tags: string[]) => void;
  value: string[];
}

const Tags = ({ maxTags, value, onChange, ...others }: TagsInputProps) => {

  const tags: string[] = React.useMemo(() => Array.isArray(value) ? value : [], [value]);

  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const maxTagsConfig = maxTags || 10;

  const addTag = React.useCallback((tagLabel: string) => {
    const newTag = tagLabel.trim();
    if (!newTag || tags.length >= maxTagsConfig) return;

    if (!tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      onChange(newTags);
    }

    setInputValue('');
  }, [tags, maxTagsConfig, onChange]);

  const removeTag = React.useCallback((tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  }, [tags, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
    else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(',')) {
      const tagLabel = value.substring(0, value.length - 1);
      addTag(tagLabel);
    } else {
      setInputValue(value);
    }
  };

  return (
    <div className='form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary min-h-11 px-3 font-normal'>
      <div className='flex items-center justify-start gap-2 flex-wrap'>
        {tags.map(tag => (
          <div key={tag} className='relative flex items-center justify-center gap-2 bg-primary pr-[20px] pl-3 rounded-xl overflow-hidden'>
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='absolute right-0 w-[20px]'
            >
              x
            </button>
          </div>
        ))}
        {tags.length < maxTagsConfig && <input
          {...others}
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={tags.length >= maxTagsConfig}
          placeholder={tags.length >= maxTagsConfig ? '' : others.placeholder}
          className='p-0 bg-transparent border-none focus:ring-0 focus:border-transparent'
        />}
      </div>
    </div>
  )
}

const Hidden = (props: InputProps) => {
  return <Input {...props} type='hidden' />
}

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return <textarea
    className='form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary min-h-[100px] placeholder:text-text-subtle p-4 text-base font-normal transition-all'
    {...props}
  />
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
}

const Select = (props: SelectProps) => {
  const { options } = props;
  return <select
    className='w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer'
  >
    {options?.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
    {props.children}
  </select>
}

interface ErrorMessageProps extends React.HTMLAttributes<HTMLElement> {
  message?: string;
}

const ErrorMessage = ({ message, ...others }: ErrorMessageProps) => {
  return message ? <p className='mt-1 text-sm text-red-600' {...others}>{message}</p> : <></>
}

FormField.Label = Label;
FormField.Input = Input;
FormField.Number = Number;
FormField.Tags = Tags;
FormField.Hidden = Hidden;
FormField.Textarea = Textarea;
FormField.Select = Select;
FormField.ErrorMessage = ErrorMessage;

export default FormField;