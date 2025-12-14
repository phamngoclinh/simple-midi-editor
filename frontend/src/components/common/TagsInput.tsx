import React, { ChangeEvent, KeyboardEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

interface TagsInputProps extends UseControllerProps<any> {
  placeholder?: string;
  maxTags?: number;
}

const TagsInput: React.FC<TagsInputProps> = (props) => {
  const { field } = useController(props);
  
  const tags: string[] = useMemo(() => Array.isArray(field.value) ? field.value : [], [field.value]);

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const maxTags = props.maxTags || 10;
  
  const addTag = useCallback((tagLabel: string) => {
    const newTag = tagLabel.trim();
    if (!newTag || tags.length >= maxTags) return;

    if (!tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      field.onChange(newTags);
    }
    
    setInputValue('');
  }, [tags, maxTags, field]);

  const removeTag = useCallback((tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    field.onChange(newTags); 
  }, [tags, field]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } 
    else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.endsWith(',')) {
        const tagLabel = value.substring(0, value.length - 1);
        addTag(tagLabel);
    } else {
        setInputValue(value);
    }
  };


  return (
    <div className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#58627a]">
      <div className='flex items-center justify-start gap-2 flex-wrap'>
        {tags.map(tag => (
          <div key={tag} className='flex items-center justify-center gap-2 bg-primary p-1 rounded-xl'>
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
            >
              x
            </button>
          </div>
        ))}
        <input
          id='tag-input'
          name='tag-input'
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? props.placeholder : tags.length !== maxTags ? 'Thêm tags...' : ''}
          className='w-[100px] h-[30px] w-full bg-[#1c1f27] border-none px-2 py-2 text-white focus:outline-none focus:border-none focus:ring-0 placeholder-[#58627a]'
          disabled={tags.length >= maxTags}
        />
      </div>
    </div>
  );
};

export default TagsInput;
