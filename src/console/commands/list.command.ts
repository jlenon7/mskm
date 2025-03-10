import { BaseCommand } from '@athenna/artisan'
import { AppService } from '#src/services/app.service'

export class ListCommand extends BaseCommand {
  public static signature(): string {
    return 'list'
  }

  public static description(): string {
    return 'List all the available SSH keys.'
  }

  public async handle(): Promise<void> {
    const service = new AppService()

    const keys = await service.getAllNamesOnly()

    if (!keys.length) {
      this.logger.error('No keys found. Please create a new one.')

      return
    }

    keys.forEach(keyPair => {
      const [name] = keyPair.split('.')
      this.logger.simple(`- ${name}`)
    })

    this.logger.info(`Total keys: ${keys.length}`)
  }
}
