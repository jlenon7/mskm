import { Argument, BaseCommand } from '@athenna/artisan'
import { AppService } from '#src/services/app.service'

export class CreateCommand extends BaseCommand {
  @Argument({
    required: true,
    description: 'The SSH key name'
  })
  private name: string

  public static signature(): string {
    return 'delete'
  }

  public static description(): string {
    return 'Delete specific SSH key by name.'
  }

  public async handle(): Promise<void> {
    const service = new AppService()

    this.logger.simple('[ Deleting SSH key ]')

    if (!(await service.findPair(this.name))) {
      this.logger.error('The key name does not exist')

      return
    }

    await service.delete(this.name)

    this.logger.success(`Successfully deleted ({bold,yellow} ${this.name}) key`)
  }
}
