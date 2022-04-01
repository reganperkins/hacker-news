const Dropdown = ({
  labelby,
  options,
  selectedValue,
  onOptionClick,
}) => {
  return (
    <select onChange={onOptionClick} aria-labelledby={labelby}>
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
