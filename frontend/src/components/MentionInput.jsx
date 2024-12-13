import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';

const MentionInput = ({ value, onChange, placeholder, className }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentions, setMentions] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Get users from Redux store
  const users = useSelector((state) => state.users?.list || []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleInput = (e) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart;
    setCursorPosition(position);

    // Check for @ symbol
    const lastAtSymbol = newValue.lastIndexOf('@', position);
    if (lastAtSymbol !== -1) {
      const afterAtSymbol = newValue.slice(lastAtSymbol + 1, position);
      if (!afterAtSymbol.includes(' ')) {
        setMentionSearch(afterAtSymbol);
        setShowSuggestions(true);
        return;
      }
    }
    setShowSuggestions(false);
    onChange(newValue, mentions);
  };

  const handleMention = (user) => {
    const beforeMention = value.slice(0, value.lastIndexOf('@'));
    const afterMention = value.slice(cursorPosition);
    const newValue = `${beforeMention}@${user.name}${afterMention}`;
    
    setMentions([...mentions, user]);
    setShowSuggestions(false);
    setMentionSearch('');
    
    if (inputRef.current) {
      inputRef.current.value = newValue;
      onChange(newValue, [...mentions, user]);
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        className={`w-full resize-none ${className}`}
      />
      
      {showSuggestions && filteredUsers.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full max-h-60 overflow-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg mt-1"
        >
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleMention(user)}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full mr-2" />
              ) : (
                <FaUser className="w-6 h-6 rounded-full mr-2 text-gray-400" />
              )}
              <span className="text-gray-900 dark:text-white">{user.name}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;
