export interface CliIo {
  cwd: string
  stderr: CliWritable
  stdout: CliWritable
}

export interface CliWritable {
  write: (message: string) => void
}
