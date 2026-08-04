import { runProcess } from "@/lib/utilities/run-process";

interface BashTypes{
  command: string[];
  dir: string;
}

export async function bash({ command, dir }: BashTypes) {

  const processResponse = await runProcess(command, dir)

  if (processResponse.success === false) {
    return {
      sucess: false,
      errorMessage: processResponse.errorMessage,
      stderr: processResponse.stderr,
      exitCode: processResponse.exitCode
    }
  }

  return {
    success: true,
    results: {
      stdout: processResponse.stdout,
      stderr: processResponse.stderr,
      exitCode: processResponse.exitCode,
    }
  }
}
