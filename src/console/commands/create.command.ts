import { Exec } from '@athenna/common'
import { Argument, BaseCommand, Option } from '@athenna/artisan'

export class CreateCommand extends BaseCommand {
  @Argument({
    required: true,
    description: 'The ssh key name'
  })
  private name: string

  @Option({
    signature: '-t, --type <type>',
    description: 'The ssh key type | Options: rsa, dsa, ecdsa, ed25519',
    default: 'rsa'
  })
  private type: 'rsa' | 'dsa' | 'ecdsa' | 'ed25519'

  @Option({
    signature: '-p, --password <password>',
    description: 'The ssh key passphrase',
    default: ''
  })
  private password: string

  public static signature(): string {
    return 'create'
  }

  public static description(): string {
    return 'Create a new SSH key.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('[ Generatting SSH key ]')

    const { stderr } = await Exec.shell(
      `ssh-keygen -t ${this.type} -N "${this.password}" -f ~/.ssh/${this.name}`
    )

    if (stderr) {
      this.logger.error(
        'An error occurred while creating the key. Check if the key already exists.'
      )

      return
    }

    this.logger.success(
      `Successfully created ({bold,yellow} ${this.name}) key on ({bold,yellow} '~/.ssh/${this.name}')`
    )
  }
}
