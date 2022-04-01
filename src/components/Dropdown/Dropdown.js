const Dropdown = ({ options, selectedValue, onOptionClick }) => {
  return (
    <select onChange={onOptionClick}>
      {options.map(({ value, label }) => (
        <option
          key={value}
          value={value}
          defaultValue={value === selectedValue}
        >
          {label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
