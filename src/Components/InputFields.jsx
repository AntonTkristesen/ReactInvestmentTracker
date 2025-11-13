import React, { useState } from "react";

export default function InputField({ header, name, value, onChange}) {
    return (
        <div>
          <label>{header}</label>
          <input
            name={name}
            type="number"
            value={value}
            onChange={(e) => onChange(name, Number(e.target.value))}
          />
        </div>
      );
}