import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
      table.string('user_id').references('users.id').onDelete('CASCADE')
      table.string('assigned')
      table.timestamp('date')
      table.integer('persons')
      table.string('email')
      table.string('last_name')
      table.string('message').nullable()
      table.enu('status', ['confirmed', 'cancelled', 'completed'], {
        useNative: true,
        enumName: 'booking_status',
        existingType: false,
      })
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
