export const genderOptions = [
  { value: "Male", label: "Masculino" },
  { value: "Female", label: "Feminino" },
];

export function genderLabel(value: string) {
  return genderOptions.find((o) => o.value === value)?.label ?? value;
}