export default function InputField({ value, onChange, placeholder = "Posez une question..." }) {
  return (
    <input
      type="text"
      className="input-field"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
