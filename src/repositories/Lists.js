/**
 * Factory function for the Lists persistance layer.
 *
 * @param {Object} dependencies - The module depencencies.
 */
module.exports = function ListsRepository ({ knex }) {
  const TABLE_LIST = 'lists'
  const TABLE_ITEMS = 'list_items'

  return {
    /**
     * Returns all the lists.
     */
    lists: () => knex(TABLE_LIST),

    /**
     * Returns a list by id.
     * @param {Number} id - The list id.
     */
    list: id => knex(TABLE_LIST).where({ id }).first(),

    /**
     * Returns a list items by list id.
     * @param {Number} listId - The list id.
     */
    items: listId => knex(TABLE_ITEMS).where({ list_id: listId }),

    /**
     * Returns an item by id.
     * @param {Number} itemId - The list item.
     */
    item: itemId => knex(TABLE_ITEMS).where({ id: itemId }).first(),

    /**
     * Creates a list.
     * @param {Object} fields - The list properties.
     * @param {String} [fields.name] - The list name.
     */
    create: fields => knex(TABLE_LIST).insert(fields),

    /**
     * Updates a list by id.
     * @param {Number} id - The list id.
     * @param {Object} fields - The fields to update
     * @param {String} [fields.name] - The new list name.
     */
    update: (id, fields) => knex(TABLE_LIST).where({ id }).update(fields),

    /**
     * Deletes a list by id.
     * @param {Number} id - The list id.
     */
    delete: id => knex(TABLE_LIST).where({ id }).delete(),

    /**
     * Adds an item for the given list.
     * @param {Number} lisitId - The list id.
     * @param {Object} fields - The item properties
     * @param {String} [fields.text] - The item content.
     * @param {Boolean} [fields.done] - The item completion status.
     */
    addItem: (listId, fields) =>
      knex(TABLE_ITEMS).insert({ ...fields, list_id: listId }),

    /**
     * Updates an item by id.
     * @param {Number} id - The item id.
     * @param {Object} fields - The new properties of the item to update.
     * @param {String} [fields.text] - The new item content.
     * @param {Boolean} [fields.done] - The new item completion status.
     */
    updateItem: (id, fields) => knex(TABLE_ITEMS).where({ id }).update(fields),

    /**
     * Deletes an item by id.
     * @param {Number} id - The item id.
     */
    deleteItem: id => knex(TABLE_ITEMS).where({ id }).delete()
  }
}
