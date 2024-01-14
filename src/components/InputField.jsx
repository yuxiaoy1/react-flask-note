export default function InputField({
  name,
  label,
  fieldRef,
  error,
  placeholder,
  type,
}) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        type={type || 'text'}
        id={name}
        ref={fieldRef}
        placeholder={placeholder || ''}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
