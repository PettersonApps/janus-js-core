import React, { useEffect, useState } from 'react';

const Form = (props) => {
  const { onSubmit } = props;

  const [value, setValue] = useState('');

  const handleChange = (e) => {
    if (e.target.value.length <= 200) {
      setValue(e.target.value);
    }
  };

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  const handleKeyUp = (e) => {
    e.preventDefault();

    if (e.key === 'Enter') {
      onSubmit(value);
      setValue('');
    }
  };

  useEffect(() => {
    return () => {
      setValue('');
    };
  }, []);

  return (
    <div className="d-flex align-center">
      <div className="flex-item-10 pr-16">
        <input
          id="chat-message"
          className="input"
          placeholder="Write message..."
          value={value}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
        />
      </div>
      <div className="flex-item-2">
        <button className="button" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Form;
