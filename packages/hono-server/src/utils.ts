export const countLoC = (code: string): number => {
  // Simple LoC counter: splits by newline and filters out empty lines or comments
  return code
    .split("\n")
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("//") && !line.trim().startsWith("/*"))
    .length;
};
