export function onlyNumbers(str: any): string {
  let result = str;

  // if (result) result = result.replace(/[^0-9]+/g, '');
  if (result && result.length) result = result.replace(/\D+/g, "");

  return result;
}
