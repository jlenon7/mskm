import { Argument, BaseCommand } from '@athenna/artisan'
import { AppService } from '#src/services/app.service'
import { File, Path } from '@athenna/common'

export class UseCommand extends BaseCommand {
  @Argument({
    required: true,
    description: 'The SSH key name'
  })
  private name: string

  public static signature(): string {
    return 'use'
  }

  public static description(): string {
    return 'Set specific SSH key as default by name.'
  }

  public async handle(): Promise<void> {
    const service = new AppService()

    if (!(await service.findPair(this.name))) {
      this.logger.error('The key name does not exist')

      return
    }

    if (await File.exists(Path.bin(service.filename))) {
      await service.setFileContent(this.name)
    } else {
      await service.createFileWithContent(this.name)
    }

    await service.changeCurrentSSHKey(this.name)

    this.logger.success(
      `({bold,white} ${this.name}) is now the default SSH key`
    )
  }
}
