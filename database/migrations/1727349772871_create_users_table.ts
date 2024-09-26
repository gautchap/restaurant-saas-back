import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').unique()
      table.string('name').nullable()
      table.string('email', 255).notNullable().unique()
      table.string('customer_id').nullable()
      table.string('price_id').nullable()
      table.enum('plan', [0, 1]).defaultTo(0)
      table.string('provider')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
