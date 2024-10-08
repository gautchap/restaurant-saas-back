import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
      table.string('user_id').references('users.id').onDelete('CASCADE')
      table.string('type').notNullable()
      table.string('name')
      table.string('shape')
      table.decimal('x')
      table.decimal('y')
      table.integer('table_number')
      table.specificType('chair_pos', 'integer ARRAY')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
