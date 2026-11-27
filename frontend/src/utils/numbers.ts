// campos de formulário vêm como texto; vazio vira undefined para o schema reclamar
export function parseNumber(value: string) {
  const text = value.trim().replace(",", ".");
  return text === "" ? undefined : Number(text);
}