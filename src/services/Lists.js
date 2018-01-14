/**
 * Factory function that creates a Lists service.
 * @param {Object} dependencies - The module dependencies.
 */
module.exports = function ListsService ({
  logging,
  listsEvents,
  listsRepository
}) {
  const logger = logging.getLogger('services.lists')
  logger.info('Creating service.')

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
          list.items = (await listsRepository.items(list.id)).map(x => ({
            ...x,
            listId: list.id
          }))
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
      list.items = (await listsRepository.items(id)).map(x => ({
        ...x,
        listId: id
      }))

      return list
    },

    /**
     * Fetch a single item.
     * @param {Number} id - The item id.
     */
    async item (id) {
      const item = await listsRepository.item(id)
      return {
        ...item,
        listId: item.list_id
      }
    },

    /**
     * Creates a list.
     * @param {String} name - The new list name.
     */
    async create (name) {
      // TODO: Validate list name (Joi ?)
      const [id] = await listsRepository.create({ name })
      const list = await this.list(id)

      listsEvents.created(list)

      return list
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
      const list = await this.list(id)

      listsEvents.updated(list)

      return list
    },

    /**
     * Deletes a list by id.
     * @param {Number} id - The list id.
     */
    async delete (id) {
      const list = await this.list(id)
      await listsRepository.delete(id)

      listsEvents.deleted(list)

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
      const item = await this.item(id)

      listsEvents.item.created(item)

      return item
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
      const oldItem = await this.item(id)

      await listsRepository.updateItem(id, updates)

      const item = await this.item(id)

      if (Boolean(oldItem.done) !== updates.done) {
        listsEvents.item.status(item)
      } else {
        listsEvents.item.updated(item)
      }

      return item
    },

    /**
     * Deletes an item by id.
     * @param {Number} id - The item id.
     */
    async deleteItem (id) {
      const { list_id: listId } = await listsRepository.item(id)
      const item = await this.item(id)
      await listsRepository.deleteItem(id)

      listsEvents.item.deleted(item)

      return this.list(listId)
    }
  }
}
