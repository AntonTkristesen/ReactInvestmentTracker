import InputFields from "./InputFields"

export default function CalaculationBox ({ formData, onFieldChange }) {
  return (
    <div id="user-input">
        <InputFields
          header="Nuværende opsparing"
          name="initialInvestment"
          value={formData.initialInvestment}
          onChange={onFieldChange}
          suffix="Kr."
        />
        <InputFields
          header="Månedlig opsparing"
          name="monthlyInvestment"
          value={formData.monthlyInvestment}
          onChange={onFieldChange}
          suffix="Kr."
        />
        <InputFields
          header="Antal år"
          name="duration"
          value={formData.duration}
          onChange={onFieldChange}
          suffix="År"
        />
        <InputFields
          header="Målbeløb (valgfrit)"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={onFieldChange}
          suffix="Kr."
        />
    </div>
  )
}