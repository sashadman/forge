import { US_STATES } from '@/lib/locations/us-states'

type StateSelectProps = {
  name?: string
  id?: string
  label?: string
  value?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  onChange?: (value: string) => void
}

export default function StateSelect({
  name = 'state',
  id,
  label = 'State',
  value,
  defaultValue,
  required = false,
  disabled = false,
  helperText,
  onChange,
}: StateSelectProps) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <select
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="input-field mt-2"
      >
        <option value="">Select state</option>

        {US_STATES.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.name} ({state.abbreviation})
          </option>
        ))}
      </select>

      {helperText && (
        <p className="mt-2 text-xs leading-5 text-slate-500">{helperText}</p>
      )}
    </label>
  )
}