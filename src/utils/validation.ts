export function onlyNumbers(str: any): string {
  let result = str;
  console.log("RESULT ANTES", result);
  // if (result) result = result.replace(/[^0-9]+/g, '');
  if (result && result.length) result = result.replace(/\D+/g, "");

  console.log("RESULT DEPOIS", result);
  return result;
}
