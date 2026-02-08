import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileInputFieldProps {
    id: string;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInputField({
    id,
    label,
    onChange,
}: FileInputFieldProps) {
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type="file" accept=".pdf" onChange={onChange} />
        </div>
    );
}
