export * from './error'

export function hasCompilationErrors(output: any): boolean {
    return (
      output.errors && output.errors.some((x: any) => x.severity === "error")
    );
  }