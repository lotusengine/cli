import { ensureDir, readdir, readFile } from 'fs-extra'
import { writeFile } from 'fs-extra'
import { homedir, userInfo } from 'os'
import { join, resolve } from 'path'
import * as childProcess from 'child_process'
import * as path from 'path'
import * as fs from 'fs-extra'
import {
  StackInitParams,
  StackProjectMeta,
  StackGenerateParams,
  StackDeployOptions
} from 'src/types/stack'
import { NonEmptyDirError, MissingAppError, ExecuteAppError } from '../errors'
import { camelCase, paramCase } from '../utils/formaUtils'
import { loadStackData, readConfig } from '@lotusengine/sdk'
import { doMutation, removeEmpty, stringifyFields } from '../query'
import { UUID } from 'src/types/common'

const VERSION = '1.0.17'

// Initialize sample stack project
export const initStack = async (params: StackInitParams) => {
  const { language, targetDirectory, projectName } = params

  await ensureEmptyDir(targetDirectory)

  const templateDir = join(process.cwd(), 'init', language)

  await bootstrapApp(templateDir, targetDirectory, {
    name: projectName,
    version: VERSION
  })
}

// Install files
export const bootstrapApp = async (
  sourceDirectory: string,
  targetDirectory: string,
  project: StackProjectMeta
) => {
  for (const file of await fs.readdir(sourceDirectory)) {
    const fromFile = join(sourceDirectory, file)
    const toFile = join(targetDirectory, replaceVars(file, project))
    if ((await fs.stat(fromFile)).isDirectory()) {
      await fs.mkdir(toFile)
      await bootstrapApp(fromFile, toFile, project)
      continue
    } else if (file.match(/^.*\.template\.[^.]+$/)) {
      await processAndCopy(
        fromFile,
        toFile.replace(/\.template(\.[^.]+)$/, '$1'),
        project
      )
      continue
    } else {
      await fs.copy(fromFile, toFile)
    }
  }
}

// Replace vars and copy files
export const processAndCopy = async (
  templatePath: string,
  toFile: string,
  project: StackProjectMeta
) => {
  const template = await readFile(templatePath, { encoding: 'utf-8' })
  await writeFile(toFile, replaceVars(template, project))
}

// Determine sdk root dir
export function sdkRootDir() {
  return process.env.LOTUS_SDK_ROOT
    ? resolve(process.env.LOTUS_SDK_ROOT)
    : join((userInfo().homedir ?? homedir()).trim() || '/', '.lotus')
}

// Replace vars
export const replaceVars = (template: string, project: StackProjectMeta) => {
  const name = camelCase(project.name)

  return template
    .replace(/helloWorld/g, name)
    .replace(/hello-world/g, paramCase(name))
    .replace(/VERSION/g, project.version)
}

// Ensure empty directory
export const ensureEmptyDir = async (dir: string): Promise<void> => {
  await ensureDir(dir)
  const files = await readdir(dir)
  if (files.filter((f) => !f.startsWith('.')).length !== 0) {
    throw new NonEmptyDirError(dir)
  }
}

// async function initializeProject(template: InitTemplate, language: string, canUseNetwork: boolean, generateOnly: boolean, workDir: string) {
//   await assertIsEmptyDirectory(workDir);
//   print(`Applying project template ${colors.green(template.name)} for ${colors.blue(language)}`);
//   await template.install(language, workDir);
//   if (await fs.pathExists('README.md')) {
//     print(colors.green(await fs.readFile('README.md', { encoding: 'utf-8' })));
//   }

//   if (!generateOnly) {
//     await initializeGitRepository(workDir);
//     await postInstall(language, canUseNetwork, workDir);
//   }

//   print('✅ All done!');
// }

// // Load stack config
// export const loadConfig = async (configPath: string) => {
//   try {
//     return await readJson(join(configPath, 'lotusengine.json'))
//   } catch (e) {
//     throw new MissingConfigError()
//   }
// }

// Generate JSON file from stack project - code heavily inspired from aws-cdk
export const generateStack = async (
  params: StackGenerateParams
): Promise<void> => {
  const { projectPath } = params
  const { app } = await readConfig({ path: projectPath })

  if (!app) throw new MissingAppError()

  const execCmd = await getCommand(app)

  await executeApp(execCmd, { projectPath })
}

// Run executable - Credit: aws-cdk
export const executeApp = async (
  execCmd: string[],
  params: { projectPath: string }
): Promise<void> => {
  const { projectPath } = params

  return new Promise((resolve, _reject) => {
    const child = childProcess.spawn(execCmd[0], execCmd.slice(1), {
      stdio: ['ignore', 'inherit', 'inherit'],
      detached: false,
      cwd: projectPath,
      shell: true
    })

    child.on('exit', (code) => {
      if (code === 0) {
        return resolve()
      } else {
        throw new ExecuteAppError()
      }
    })
  })
}

// Execute the given file with the same 'node' process as is running the current process
function executeNode(scriptFile: string): string[] {
  return [process.execPath, scriptFile]
}

// Build exec command
async function getCommand(app: string): Promise<string[]> {
  const commandMap = new Map<string, (file: string) => string[]>([
    ['.js', executeNode]
  ])

  const execCmd = typeof app === 'string' ? app.split(' ') : app

  if (execCmd.length === 1) {
    let fstat

    try {
      fstat = await fs.stat(execCmd[0])
    } catch (error) {
      return execCmd
    }

    // eslint-disable-next-line no-bitwise
    const isExecutable = (fstat.mode & fs.constants.X_OK) !== 0
    const isWindows = process.platform === 'win32'

    const handler = commandMap.get(path.extname(execCmd[0]))
    if (handler && (!isExecutable || isWindows)) {
      return handler(execCmd[0])
    }
  }
  return execCmd
}

// Deploy a stack
export const deployStack = async (
  params: StackDeployOptions
): Promise<{ id: UUID }> => {
  const { app } = params
  const stack = await loadStackData({ path: app })

  const query = `mutation DeployStack($input: DeployStackInput!) {
    deployStack(input: $input) {
        id
      }
    }`

  const res = await doMutation(query, {
    input: removeEmpty(stringifyFields({ stack }, ['stack']))
  })

  return res.data.deployStack
}
