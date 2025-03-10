import { BaseCommand } from '@athenna/artisan'
import { AppService } from '#src/services/app.service'
import { File, Path } from '@athenna/common'

export class CurrentCommand extends BaseCommand {
  public static signature(): string {
    return 'current'
  }

  public static description(): string {
    return 'Show current SSH key name.'
  }

  public async handle(): Promise<void> {
    const service = new AppService()

    const existentKeys = await service.getAll()

    let currentKeyName = 'id_rsa'

    if (!existentKeys.length) {
      this.logger.error('No SSH keys found. Please create one first')

      return
    }

    if (existentKeys.length === 1) {
      currentKeyName = existentKeys[0]
    }

    if (await File.exists(Path.bin(service.filename))) {
      currentKeyName = await service.getFileContent()
    } else {
      if (!(await service.findPair(currentKeyName))) {
        this.logger.error(
          'Please set a default SSH key first with the command "use"'
        )

        return
      }

      await service.createFileWithContent(currentKeyName)
    }

    this.logger.success(
      `({bold,white} ${currentKeyName}) is the current SSH key`
    )
  }
}
