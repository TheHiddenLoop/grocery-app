const InputField = ({
  name,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = "text",
  className = "",
  active = false,
}) => (
  <div className={`relative mb-4 ${className}`}>
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className="h-5 w-5 text-text-secondary" />
      </div>
    )}

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={active}
      placeholder={placeholder}
      className="
        w-full
        pl-12
        pr-4
        py-3
        ms:py-3
        bg-bg-secondary
        border
        border-border
        rounded-xl
        focus:ring-2
        focus:ring-primary
        focus:border-primary
        transition-skin
        duration-300
        text-text-primary
        placeholder-text-secondary
        shadow-skin
        backdrop-blur-sm
      "
    />
  </div>
);

export default InputField;
