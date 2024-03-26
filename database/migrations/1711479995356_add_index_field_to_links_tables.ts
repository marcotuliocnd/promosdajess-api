import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddIndexFieldToLinksTables extends BaseSchema {
  protected tableName = 'links'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('index').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('index')
    })
  }
}
