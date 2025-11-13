import InputFields from "./InputFields"

export default function CalaculationBox ({ formData, onFieldChange }) {
  return (
    <div id="user-input">
        <div className="input-group">
        <InputFields
        header="Initial Investment"
        name="initialInvestment"
        value={formData.initialInvestment}
        onChange={onFieldChange}
      />
      <InputFields
        header="Annual Investment"
        name="annualInvestment"
        value={formData.annualInvestment}
        onChange={onFieldChange}
      />
      <InputFields
        header="Expected Return (%)"
        name="expectedReturn"
        value={formData.expectedReturn}
        onChange={onFieldChange}
      />
      <InputFields
        header="Duration (years)"
        name="duration"
        value={formData.duration}
        onChange={onFieldChange}
      />
        </div>
    </div>
  )
}