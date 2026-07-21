export interface CliWritable {
  write: (message: string) => void
}

export interface CliIo {
  cwd: string
  stderr: CliWritable
  stdout: CliWritable
}
