import React, { ChangeEvent, KeyboardEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

// Interface cho TagsInputProps, mở rộng từ RHF Controller Props
interface TagsInputProps extends UseControllerProps<any> {
  placeholder?: string;
  maxTags?: number;
}

/**
 * Component nhập Tags (Mảng String) tích hợp với React Hook Form
 * @param props UseControllerProps (name, control) và các props tùy chỉnh
 */
const TagsInput: React.FC<TagsInputProps> = (props) => {
  // Lấy ra control, field (value/onChange) từ RHF
  const { field } = useController(props);
  
  // Giá trị hiện tại của Tags (luôn là mảng string)
  const tags: string[] = useMemo(() => Array.isArray(field.value) ? field.value : [], [field.value]);

  // State cục bộ cho input đang gõ
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const maxTags = props.maxTags || 10;
  
  // --- Thêm Tag mới ---
  const addTag = useCallback((tagLabel: string) => {
    const newTag = tagLabel.trim();
    if (!newTag || tags.length >= maxTags) return;

    // Kiểm tra trùng lặp và thêm vào danh sách
    if (!tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      field.onChange(newTags); // 💥 Cập nhật giá trị RHF
    }
    
    setInputValue(''); // Xóa input
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
    <div className="w-full bg-[#1c1f27] border border-[#3b4354] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#58627a] text-sm">
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
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? props.placeholder || 'Thêm tags...' : ''}
          className='h-[30px] w-full bg-[#1c1f27] border-none px-3 py-2 text-white focus:outline-none focus:border-none placeholder-[#58627a] text-sm'
          disabled={tags.length >= maxTags}
        />
      </div>
    </div>
  );
};

export default TagsInput;
