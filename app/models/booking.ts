import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Booking extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare date: Date

  @column()
  declare persons: number

  @column()
  declare email: string

  @column()
  declare lastName: string

  @column()
  declare message: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { localKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(booking: Booking) {
    booking.id = randomUUID()
  }
}
