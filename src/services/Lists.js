/**
 * Factory function that creates a Lists service.
 * @param {Object} dependencies - The module dependencies.
 */
module.exports = function ListsService ({ listsRepository }) {
  return {
    /**
     * Finds all lists with their nested items.
     */
    async lists () {
      // 1. Get all lists from the repository
      const lists = await listsRepository.lists()

      // 2. Concurrently add each list's items.
      await Promise.all(
        lists.map(async list => {
          list.items = await listsRepository.items(list.id)
        })
      )

      return lists
    },

    /**
     * Fetch a single list with its nested items.
     * @param {Number} id - The list id.
     */
    async list (id) {
      const list = await listsRepository.list(id)
      list.items = await listsRepository.items(id)

      return list
    },

    /**
     * Fetch a single item.
     * @param {Number} id - The item id.
     */
    item (id) {
      return listsRepository.item(id)
    },

    /**
     * Creates a list.
     * @param {String} name - The new list name.
     */
    async create (name) {
      // TODO: Validate list name (Joi ?)
      const [id] = await listsRepository.create({ name })

      return this.list(id)
    },

    /**
     * Updates a list.
     * @param {Number} id - The id of the list to update.
     * @param {Object} updates - The fields to update.
     * @param {String} updates.name - The new list name.
     */
    async update (id, updates) {
      // TODO: Validate updates (Joi ?)
      await listsRepository.update(id, updates)

      return this.list(id)
    },

    /**
     * Deletes a list by id.
     * @param {Number} id - The list id.
     */
    async delete (id) {
      await listsRepository.delete(id)

      return { id }
    },

    /**
     * Adds an item to the given list.
     * The item completion status will be set to false.
     *
     * @param {Number} listId - The list id.
     * @param {String} text - The item text.
     */
    async addItem (listId, text) {
      // TODO: Validate items (Joi ?)
      const [id] = await listsRepository.addItem(listId, { text, done: false })

      return this.item(id)
    },

    /**
     * Updates a list item.
     * @param {Number} id - The list id.
     * @param {Object} updates - The fields to update.
     * @param {String} [updates.text] - The new item content.
     * @param {Boolean} [updates.done] - The new item completion status.
     */
    async updateItem (id, updates) {
      // TODO: Validate updates (Joi ?)
      await listsRepository.updateItem(id, updates)

      return this.item(id)
    },

    /**
     * Deletes an item by id.
     * @param {Number} id - The item id.
     */
    async deleteItem (id) {
      const { list_id: listId } = await listsRepository.item(id)
      await listsRepository.deleteItem(id)

      return this.list(listId)
    }
  }
}
