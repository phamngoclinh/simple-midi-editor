import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { DEFAULT_COLORS } from '../../utils/color';
import { MUSIC_ICONS } from '../../utils/icons';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function FormField({ children, ...others }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full" {...others}>
      {children}
    </div>
  );
}

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className="text-muted-foreground text-base font-medium leading-normal" {...props} />
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightIcon, ...others }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="material-symbols-outlined absolute left-3 top-3 text-muted-foreground !text-[20px]">
            {leftIcon}
          </span>
        )}
        <input
          className={`form-input flex w-full rounded-lg text-foreground focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-input focus:border-primary h-11 px-3 py-2 font-normal
          ${leftIcon ? 'pl-10' : ''}
          ${rightIcon ? 'pr-10' : ''}
        `}
          ref={ref}
          {...others}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'FormFieldInput';

const Number = (props: InputProps) => {
  return <Input {...props} type="number" />;
};

interface TagsInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  maxTags?: number;
  onChange: (tags: string[]) => void;
  value: string[];
}

const Tags = ({ maxTags, value, onChange, ...others }: TagsInputProps) => {
  const tags: string[] = React.useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const maxTagsConfig = maxTags || 10;

  const addTag = React.useCallback(
    (tagLabel: string) => {
      const newTag = tagLabel.trim();
      if (!newTag || tags.length >= maxTagsConfig) return;

      if (!tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange(newTags);
      }

      setInputValue('');
    },
    [tags, maxTagsConfig, onChange],
  );

  const removeTag = React.useCallback(
    (tagToRemove: string) => {
      const newTags = tags.filter(tag => tag !== tagToRemove);
      onChange(newTags);
    },
    [tags, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
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
    <div className="form-input flex w-full rounded-lg text-foreground focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-input focus:border-primary min-h-11 px-3 font-normal">
      <div className="flex items-center justify-start gap-2 flex-wrap">
        {tags.map(tag => (
          <div
            key={tag}
            className="relative flex items-center justify-center gap-2 bg-primary text-white pr-[20px] pl-3 rounded-xl overflow-hidden"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="cursor-pointer absolute right-0 w-[20px] text-white/70 hover:text-white"
            >
              x
            </button>
          </div>
        ))}
        {tags.length < maxTagsConfig && (
          <input
            {...others}
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={tags.length >= maxTagsConfig}
            placeholder={tags.length >= maxTagsConfig ? '' : others.placeholder}
            className="p-0 bg-transparent border-none focus:ring-0 focus:border-transparent"
          />
        )}
      </div>
    </div>
  );
};

const Hidden = (props: InputProps) => {
  return <Input {...props} type="hidden" />;
};

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className="form-input flex w-full resize-none overflow-hidden rounded-lg text-foreground focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-input focus:border-primary min-h-[100px] placeholder:text-muted-foreground px-3 py-2 text-base font-normal transition-all"
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
}

const Select = (props: SelectProps) => {
  const { options, children, ...rest } = props;
  return (
    <select
      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
      {...rest}
    >
      {options?.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {children}
    </select>
  );
};

interface ColorProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Color = (props: ColorProps) => {
  const { theme } = useTheme();
  const { value, onChange, ...rest } = props;
  const [data, setData] = useState(String(value));
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(String(value));
  }, [value]);

  const customColorCls = DEFAULT_COLORS.includes(data) ? '' : `ring-4`;

  useEffect(() => {
    if (myRef.current) {
      DEFAULT_COLORS.includes(data)
        ? myRef.current.style.removeProperty('--tw-ring-color')
        : myRef.current.style.setProperty('--tw-ring-color', data);
    }
  }, [data]);

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {DEFAULT_COLORS.map((color, index) => {
        const activeClass = color === data ? 'ring-4' : '';
        return (
          <div key={`color-${index}`}>
            <input
              type="radio"
              {...rest}
              className="appearance-none hidden"
              value={color}
              onChange={e => {
                setData(color);
                onChange?.(e);
              }}
              name="color"
              id={`color-${color}`}
            />
            <label
              htmlFor={`color-${color}`}
              style={
                {
                  backgroundColor: color,
                  '--tw-ring-color':
                    color === data
                      ? theme === 'dark'
                        ? 'var(--foreground)'
                        : '#64748b'
                      : 'transparent',
                } as React.CSSProperties
              }
              className={`block w-8 h-8 rounded-full ${activeClass} hover:ring-4 transition-all cursor-pointer`}
            ></label>
          </div>
        );
      })}

      <div
        className={`relative w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:ring-4 ${customColorCls}`}
        ref={myRef}
      >
        <label
          className="material-symbols-outlined absolute top-0 left-0 w-full h-full z-10 cursor-pointer bg-slate-300 flex! justify-center items-center"
          htmlFor="color-custom"
        >
          add
        </label>
        <input
          type="color"
          value={value}
          id="color-custom"
          name="color"
          style={{ transform: 'scale(1.7)' }}
          className="absolute top-0 left-0 w-full h-full"
          onChange={e => {
            setData(e.target.value);
            onChange?.(e);
          }}
        />
      </div>
    </div>
  );
};

interface MusicIconProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const MusicIcon = (props: MusicIconProps) => {
  const { value, onChange, name } = props;
  const [data, setData] = useState(String(value));

  useEffect(() => {
    setData(String(value));
  }, [value]);

  return (
    <>
      {MUSIC_ICONS.map(icon => {
        const activeClass = icon.key === data ? 'bg-primary' : 'bg-muted';
        return (
          <div key={`icon-${icon.key}`}>
            <input
              id={`icon-${icon.key}`}
              type="radio"
              value={icon.key}
              name={name || 'music_icon'}
              className="appearance-none hidden"
              onChange={e => onChange?.(e)}
            />
            <label
              htmlFor={`icon-${icon.key}`}
              className={`aspect-square rounded ${activeClass} text-white flex items-center justify-center border border-transparent cursor-pointer`}
            >
              <span className="material-symbols-outlined text-lg">{icon.key}</span>
            </label>
          </div>
        );
      })}
    </>
  );
};

interface ErrorMessageProps extends React.HTMLAttributes<HTMLElement> {
  message?: string;
}

const ErrorMessage = ({ message, ...others }: ErrorMessageProps) => {
  return message ? (
    <p className="mt-1 text-sm text-red-600" {...others}>
      {message}
    </p>
  ) : (
    <></>
  );
};

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
