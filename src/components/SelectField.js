function SelectField({ label, value, onChange, options, disabled = false }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export default SelectField;
