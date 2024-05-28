export function createSlug(paramName: string): string {
  const slugSemAcentos = paramName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const finalSlug = slugSemAcentos.toLowerCase().replace(/\s+/g, '-');
  return finalSlug;
}