import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('type').notNullable()
      table.string('name')
      table.string('shape')
      table.integer('x')
      table.integer('y')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
