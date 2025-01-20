const FormInput = ({
  label,
  type = 'text',
  id,
  error,
  showPasswordToggle,
  onTogglePassword,
  isPasswordVisible,
  ...props
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          className={`form-input ${error ? 'border-error' : ''}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="password-toggle"
            aria-label={`${isPasswordVisible ? 'Hide' : 'Show'} password`}
          >
            <i className={`fa fa-eye${isPasswordVisible ? '-slash' : ''}`} />
          </button>
        )}
      </div>
      {error && <span className="text-error text-sm mt-1 block">{error}</span>}
    </div>
  );
};

export default FormInput; 