import { Exec, File, Path } from '@athenna/common'
import { Service } from '@athenna/ioc'

@Service()
export class AppService {
  public filename: string = 'mskm.mskm'

  public async getAll() {
    const { stdout } = await Exec.shell(`ls ~/.ssh`)

    const keys = stdout.split('\n')

    if (!keys.length) {
      return []
    }

    const keyPairs = keys.filter(key => key.includes('.pub'))

    if (!keyPairs.length) {
      return []
    }

    return keyPairs
  }

  public async getAllPairs() {
    const { stdout } = await Exec.shell(`ls ~/.ssh`)

    const keys = stdout.split('\n')

    if (!keys.length) {
      return []
    }

    const keyPairs: string[] = []

    keys.forEach(key => {
      const extension = key.split('.')[1]

      if (extension === 'pub') {
        const name = key.split('.')[0]

        const privateKey = keys.find(i => i === `${name}`)

        if (privateKey) {
          keyPairs.push(name)
          keyPairs.push(key)
        }
      }
    })

    return keyPairs
  }

  public async getAllNamesOnly() {
    const keys = await this.getAll()

    return keys.map(key => key.split('.')[0])
  }

  public async getOne(name: string) {
    const keys = await this.getAll()

    if (!keys.find(key => key.includes(name))) {
      return false
    }

    const { stdout } = await Exec.shell(`cat ~/.ssh/${name}.pub`)

    return stdout
  }

  public async copyByName(name: string) {
    const keys = await this.getAll()

    if (!keys.find(key => key.includes(name))) {
      return false
    }

    await Exec.shell(`cat ~/.ssh/${name}.pub | pbcopy`)

    return true
  }

  public async findPair(name: string) {
    const keys = await this.getAllPairs()

    const publicKey = keys.find(i => i === `${name}.pub`)
    const privateKey = keys.find(i => i === `${name}`)

    if (!publicKey && !privateKey) {
      return false
    }

    return true
  }

  public async delete(name: string) {
    await Exec.shell(`rm -f ~/.ssh/${name}`)
    await Exec.shell(`rm -f ~/.ssh/${name}.pub`)

    return true
  }

  public async createFileWithContent(content: string) {
    const file = new File(Path.bin(this.filename), content)

    await file.load({ withContent: true })
  }

  public async getFileContent() {
    const currentFile = new File(Path.bin(this.filename))

    return currentFile.getContentAsString()
  }

  public async setFileContent(content: string) {
    const currentFile = new File(Path.bin(this.filename))

    await currentFile.setContent(content)
  }

  public async changeCurrentSSHKey(name: string) {
    await Exec.shell('ssh-add -D')
    await Exec.shell(`ssh-add ~/.ssh/${name}`)
  }
}
