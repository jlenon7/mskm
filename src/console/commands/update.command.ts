import { File, HttpClient, Path } from '@athenna/common'
import { BaseCommand } from '@athenna/artisan'

export class UpdateCommand extends BaseCommand {
  public static signature(): string {
    return 'update'
  }

  public static description(): string {
    return 'Update CLI to the latest version.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('[ Looking for updates ]')

    const { name: version } = await HttpClient.builder()
      .prefixUrl('https://api.github.com')
      .resolveBodyOnly(true)
      .throwHttpErrors(false)
      .header('Accept', 'application/vnd.github+json')
      .header('X-GitHub-Api-Version', '2022-11-28')
      .get('/repos/txsoura/mksm/releases/latest')
      .json<any>()

    if (!version) {
      this.logger.error('The repository could not be found')

      return
    }

    this.logger.simple(`Available update version: ({bold,green} ${version})`)

    const task = this.logger.task()

    task.addPromise('Downloading update...', () => {
      return this.npm.install('@txsoura/mskm', { args: ['-g'] })
    })

    await task.run()

    const pkgJson = await new File(Path.pwd('package.json')).getContentAsJson()

    this.logger.success(
      `Successfully updated ({bold,yellow} @txsoura/mskm) to version ({bold,yellow} ${pkgJson.version})`
    )
  }
}
