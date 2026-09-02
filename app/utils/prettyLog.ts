export function prettyLog<T>(arg: T, description?: string): void {
  try {
    const json: string = JSON.stringify(arg, null, 2);
    console.log(description ? `${description}:\n${json}` : json);
  } catch {
    console.log('cannot convert into json');
  }
}
