import { Argument, BaseCommand } from '@athenna/artisan'
import { AppService } from '#src/services/app.service'

export class CreateCommand extends BaseCommand {
  @Argument({
    required: true,
    description: 'The SSH key name'
  })
  private name: string

  public static signature(): string {
    return 'show'
  }

  public static description(): string {
    return 'Show specific SSH public key by name.'
  }

  public async handle(): Promise<void> {
    const service = new AppService()

    const publicKey = await service.getOne(this.name)

    if (!publicKey) {
      this.logger.error('The key name does not exist')

      return
    }

    this.logger.simple(`[ ({bold,green} ${this.name} public key) ]`)

    this.logger.simple(publicKey)

    this.logger.simple('[ ============================================== ]')
  }
}
