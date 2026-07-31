export async function runProcess(command: string[], dir: string,) {
  try {
    const proc = Bun.spawn(command, {
      stdout: "pipe",
      stderr: "pipe",
      cwd: dir,
      timeout: 60000,
    })

    return  {
        stdout: await proc.stdout.text(),
        stderr: await proc.stderr.text(),
        exitCode: await proc.exitCode,
    }
  } catch (err) {
    return {
      success: false,
      errorMessage: err instanceof Error ? err.message : "Unable to run the bash command"
    }
  }
}
