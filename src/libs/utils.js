export function getCharByIndex(index) {
  if (typeof index !== "number") {
    return;
  }
  return getCharsList()[index];
}

export function getCharsList() {
  const chars = String.fromCharCode(...Array(123).keys()).slice(48);
  return chars.toUpperCase().split("");
}
