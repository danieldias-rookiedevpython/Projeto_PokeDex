import type  { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function FormField({ label, error, id, ...rest }: Props) {
    return (
        <div className="form-field">
            <label htmlFor={id}>{label}</label>
            <input id={id} aria-invalid={!!error} {...rest} />
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}