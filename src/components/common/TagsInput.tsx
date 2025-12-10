import React, { ChangeEvent, KeyboardEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { containerStyle, errorStyle, infoStyle, inputStyle, removeButtonStyle, tagContainerStyle, tagPillStyle } from './TagsInput.styles';

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
  const { field, fieldState: { error } } = useController(props);
  
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

  // --- Xóa Tag ---
  const removeTag = useCallback((tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    field.onChange(newTags); // 💥 Cập nhật giá trị RHF
  }, [tags, field]);

  // --- Xử lý sự kiện bàn phím (Enter, Dấu phẩy) ---
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // Ngăn chặn form submit
      addTag(inputValue);
    } 
    // Xử lý xóa Tag cuối cùng khi Backspace và input rỗng
    else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
    }
  };

  // --- Xử lý sự kiện nhập liệu ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Nếu người dùng nhập dấu phẩy, tự động thêm tag trước dấu phẩy đó
    if (value.endsWith(',')) {
        const tagLabel = value.substring(0, value.length - 1);
        addTag(tagLabel);
    } else {
        setInputValue(value);
    }
  };


  return (
    <div style={containerStyle}>
      <div style={tagContainerStyle}>
        
        {/* 1. Hiển thị các Tags đã có */}
        {tags.map(tag => (
          <div key={tag} style={tagPillStyle}>
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
              style={removeButtonStyle}
            >
              x
            </button>
          </div>
        ))}

        {/* 2. Input để thêm Tags mới */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? props.placeholder || 'Thêm tags...' : ''}
          style={inputStyle}
          disabled={tags.length >= maxTags}
        />
      </div>
      
      {/* Hiển thị lỗi từ RHF */}
      {error && <p style={errorStyle}>{error.message}</p>}
      
      {/* Thông tin Max Tags */}
      {tags.length >= maxTags && (
        <p style={infoStyle}>Đã đạt giới hạn {maxTags} tags.</p>
      )}
    </div>
  );
};

export default TagsInput;
