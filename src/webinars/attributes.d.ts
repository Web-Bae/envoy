// custom-types.d.ts
interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fsAttributes: any[]; // Change 'any' to a more specific type if you know the structure of fsAttributes
}
