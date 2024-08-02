import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
      table.string('user_id').references('users.id').onDelete('CASCADE')
      table.date('date')
      table.integer('persons')
      table.string('email')
      table.string('last_name')
      table.string('message').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
