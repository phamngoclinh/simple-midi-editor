import React, { forwardRef, useEffect, useState } from 'react';
import { DEFAULT_COLORS } from '../../utils/color';
import { MUSIC_ICONS } from '../../utils/icons';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function FormField({ children, ...others }: FormFieldProps) {
  return <div className='flex flex-col gap-2 w-full' {...others}>
    {children}
  </div>
};

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return <label className='text-[#9da6b9] text-base font-medium leading-normal' {...props} />
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
        className={`form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary h-11 px-3 py-2 font-normal
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
    className='form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-surface-input focus:border-primary min-h-[100px] placeholder:text-text-subtle px-3 py-2 text-base font-normal transition-all'
    {...props}
  />
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
}

const Select = (props: SelectProps) => {
  const { options, children, ...rest } = props;
  return <select
    className='w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer'
    {...rest}
  >
    {options?.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
    {children}
  </select>
}

interface ColorProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Color = (props: ColorProps) => {
  const { value, onChange, ...rest } = props;
  const [data, setData] = useState(String(value));

  useEffect(() => {
    setData(String(value));
  }, [value])

  return (
    <div className='flex gap-2 flex-wrap'>
      {DEFAULT_COLORS.map((color, index) => {
        const activeClass = color === data ? 'ring-2 ring-offset-2 ring-offset-[#111318]' : '';
        return (
          <div key={`color-${index}`}>
            <input
              type='radio'
              {...rest}
              className='appearance-none hidden'
              value={color}
              onChange={e => {
                setData(color);
                onChange?.(e);
              }}
              id={`color-${color}`}
            />
            <label
              htmlFor={`color-${color}`}
              className={`block w-8 h-8 rounded-full bg-[${color}] ${activeClass} hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#111318] transition-all`}
            >
            </label>
          </div>
        )
      })}

      <div className={`relative w-8 h-8 border-4 border-[${DEFAULT_COLORS.includes(String(data)) ? '#3b4354' : data}] rounded-full overflow-hidden cursor-pointer hover:border-[#4b5563]`}>
        <label className='material-symbols-outlined absolute top-0 left-0 w-full h-full z-10 cursor-pointer bg-[#000000]' htmlFor='color-custom'>add</label>
        <input
          type='color'
          value={value}
          id='color-custom'
          className={`absolute top-0 left-0 w-full h-full scale-[1.7]`}
          onChange={e => {
            setData(e.target.value);
            onChange?.(e);
          }}
        />
      </div>
    </div>
  )
}

interface MusicIconProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const MusicIcon = (props: MusicIconProps) => {
  const { value, onChange, name } = props;
  const [data, setData] = useState(String(value));

  useEffect(() => {
    setData(String(value));
  }, [value])

  return (
    <>
      {MUSIC_ICONS.map(icon => {
        const activeClass = icon.key === data ? 'bg-primary' : 'bg-[#1c1f27]';
        return (
          <div key={`icon-${icon.key}`}>
            <input
              id={`icon-${icon.key}`}
              type='radio'
              value={icon.key}
              name={name || 'music_icon'}
              className='appearance-none hidden'
              onChange={(e) => onChange?.(e)}
            />
            <label
              htmlFor={`icon-${icon.key}`}
              className={`aspect-square rounded ${activeClass} text-white flex items-center justify-center border border-transparent cursor-pointer`}
            >
              <span className='material-symbols-outlined text-lg'>{icon.key}</span>
            </label>
          </div>
        )
      })}
    </>
  )
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
FormField.Color = Color;
FormField.MusicIcon = MusicIcon;
FormField.ErrorMessage = ErrorMessage;

export default FormField;