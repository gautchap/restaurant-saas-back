import type { HasMany } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { randomUUID } from 'node:crypto'
import Booking from '#models/booking'

export default class User extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column()
  declare customerId: string | null

  @column()
  declare priceId: string | null

  @column()
  declare plan: 0 | 1

  @column()
  declare provider: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @hasMany(() => Item, { foreignKey: 'userId' })
  declare items: HasMany<typeof Item>

  @hasMany(() => Booking, { foreignKey: 'userId' })
  declare bookings: HasMany<typeof Booking>

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }
}
