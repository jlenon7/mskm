import { Argument, BaseCommand } from '@athenna/artisan'
import { AppService } from '#src/services/app.service'

export class CreateCommand extends BaseCommand {
  @Argument({
    required: true,
    description: 'The ssh key name'
  })
  private name: string

  public static signature(): string {
    return 'copy'
  }

  public static description(): string {
    return 'Copy specific SSH public key by name.'
  }

  public async handle(): Promise<void> {
    const service = new AppService()

    const copied = await service.copyByName(this.name)

    if (!copied) {
      this.logger.error('The key name does not exist')

      return
    }

    this.logger.success(`${this.name} public key copied to your clipboard`)
  }
}
