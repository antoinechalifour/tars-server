module.exports = ({ knex }) => {
  const TABLE_LIST = 'lists'
  const TABLE_ITEMS = 'list_items'

  return {
    lists: () => knex(TABLE_LIST),
    list: id => knex(TABLE_LIST).where({ id }).first(),
    items: listId => knex(TABLE_ITEMS).where({ list_id: listId }),
    item: itemId => knex(TABLE_ITEMS).where({ id: itemId }).first(),
    create: fields => knex(TABLE_LIST).insert(fields),
    update: (id, fields) => knex(TABLE_LIST).where({ id }).update(fields),
    delete: id => knex(TABLE_LIST).where({ id }).delete(),
    addItem: (listId, fields) =>
      knex(TABLE_ITEMS).insert({ ...fields, list_id: listId }),
    updateItem: (id, fields) => knex(TABLE_ITEMS).where({ id }).update(fields),
    deleteItem: id => knex(TABLE_ITEMS).where({ id }).delete()
  }
}
