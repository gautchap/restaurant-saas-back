import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Item extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare type: string

  @column()
  declare name: string

  @column()
  declare shape: string

  @column()
  declare x: number

  @column()
  declare y: number

  @column()
  declare tableNumber: number

  @column()
  declare chairPos: number[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User, { localKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(item: Item) {
    item.id = randomUUID()
  }
}
