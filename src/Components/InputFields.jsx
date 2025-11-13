import React from "react";

export default function InputField({ header, name, value, onChange, suffix }) {
    return (
        <div className="input-field">
          <label>{header}</label>
          <div className="input-wrapper">
            <input
              name={name}
              type="number"
              value={value || ""}
              onChange={(e) => onChange(name, e.target.value)}
              placeholder="0"
            />
            {suffix && <span className="input-suffix">{suffix}</span>}
          </div>
        </div>
      );
}