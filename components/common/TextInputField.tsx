import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TextInputFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

export default function TextInputField({ id, label, placeholder, value, onChange, type = "text" }: TextInputFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
