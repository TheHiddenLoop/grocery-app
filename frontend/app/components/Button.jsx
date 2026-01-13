import React from "react";

function Button({
  text,
  onClick,
  disabled = false,
  type,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-semibold
        py-3
        rounded-lg
        transition-skin
        focus:outline-none
        transform
        hover:scale-[1.02]
        active:scale-[0.98]
        text-sm
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {text}
    </button>
  );
}

export default Button;
