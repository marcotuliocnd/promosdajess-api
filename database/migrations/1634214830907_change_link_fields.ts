import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChangeLinkFields extends BaseSchema {
  protected tableName = 'links'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.text('link').notNullable().alter()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.string('link').notNullable().alter()
    })
  }
}
