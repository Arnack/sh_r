'use client'

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Entity {
  code: string;
  name: string;
}

interface AutocompleteProps {
  data: Entity[];
  onSelect: (entity: Entity) => void;
  placeholder?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ data, onSelect, placeholder = 'Search...' }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredData, setFilteredData] = useState<Entity[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setFilteredData([]);
      return;
    }

    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.code.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 7);

    setFilteredData(filtered);
    
    // Auto-select if only one result
    if (filtered.length === 1) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [inputValue, data, isFocused]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || filteredData.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const nextIndex = prev < filteredData.length - 1 ? prev + 1 : prev;
          // Scroll into view if needed
          if (suggestionsRef.current) {
            const selectedElement = suggestionsRef.current.children[nextIndex] as HTMLElement;
            if (selectedElement) {
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : 0;
          // Scroll into view if needed
          if (suggestionsRef.current) {
            const selectedElement = suggestionsRef.current.children[nextIndex] as HTMLElement;
            if (selectedElement) {
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredData.length) {
          handleSelect(filteredData[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsFocused(false);
        break;
    }
  };

  const handleSelect = (entity: Entity) => {
    setInputValue(entity.name);
    setSelectedEntity(entity);
    onSelect(entity);
    setIsFocused(false);
  };

  const handleClear = () => {
    setInputValue('');
    setFilteredData(data);
    setSelectedIndex(-1);
    setSelectedEntity(null);
    inputRef.current?.focus();
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</span> : part
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:text-gray-300"
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      
      {isFocused && filteredData.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-700"
        >
          {filteredData.map((item, index) => (
            <div
              key={item.code}
              className={`px-4 py-2 cursor-pointer flex justify-start items-center gap-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                index === selectedIndex ? 'bg-slate-100 dark:bg-slate-900' : ''
              }`}
              onClick={() => handleSelect(item)}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 w-1/4 truncate">{highlightText(item.code, inputValue)}</div>
              <div className="font-medium truncate">{highlightText(item.name, inputValue)}</div>
            </div>
          ))}
        </div>
      )}
      {selectedEntity && (
        <div className='text-sm text-gray-500 dark:text-gray-400'>
            {selectedEntity.name}
            </div>
      )}
    </div>
  );
};

export default Autocomplete;
