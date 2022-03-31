import { useEffect, useRef } from 'react';

const InputWithLabel = ({
  id,
  children,
  onInputChange,
  isFocused,
  type = 'text',
  ...inputProps
}) => {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        onChange={onInputChange}
        type={type}
        {...inputProps}
      />
    </>
  );
};

export default InputWithLabel;
