import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {TaskManager} from '../target/types/task_manager'

describe('task_manager', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.TaskManager as Program<TaskManager>

  const task_managerKeypair = Keypair.generate()

  it('Initialize TaskManager', async () => {
    await program.methods
      .initialize()
      .accounts({
        task_manager: task_managerKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([task_managerKeypair])
      .rpc()

    const currentCount = await program.account.task_manager.fetch(task_managerKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment TaskManager', async () => {
    await program.methods.increment().accounts({ task_manager: task_managerKeypair.publicKey }).rpc()

    const currentCount = await program.account.task_manager.fetch(task_managerKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment TaskManager Again', async () => {
    await program.methods.increment().accounts({ task_manager: task_managerKeypair.publicKey }).rpc()

    const currentCount = await program.account.task_manager.fetch(task_managerKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement TaskManager', async () => {
    await program.methods.decrement().accounts({ task_manager: task_managerKeypair.publicKey }).rpc()

    const currentCount = await program.account.task_manager.fetch(task_managerKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set task_manager value', async () => {
    await program.methods.set(42).accounts({ task_manager: task_managerKeypair.publicKey }).rpc()

    const currentCount = await program.account.task_manager.fetch(task_managerKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the task_manager account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        task_manager: task_managerKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.task_manager.fetchNullable(task_managerKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
