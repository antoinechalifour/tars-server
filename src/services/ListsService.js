module.exports = ({ listsRepository }) => ({
  async lists () {
    const lists = await listsRepository.lists()

    await Promise.all(
      lists.map(async list => {
        list.items = await listsRepository.items(list.id)
      })
    )

    return lists
  },

  async list (id) {
    const list = await listsRepository.list(id)
    list.items = await listsRepository.items(id)

    return list
  },

  async create (name) {
    const [id] = await listsRepository.create({ name })
    return this.list(id)
  },

  async update (id, updates) {
    await listsRepository.update(id, updates)
    return this.list(id)
  },

  async delete (id) {
    await listsRepository.delete(id)
    return { id }
  },

  async addItem (listId, text) {
    await listsRepository.addItem(listId, { text, done: false })
    return this.list(listId)
  },

  async updateItem (id, updates) {
    await listsRepository.updateItem(id, updates)
    const { list_id: listId } = await listsRepository.item(id)
    return this.list(listId)
  },

  async deleteItem (id) {
    const { list_id: listId } = await listsRepository.item(id)
    await listsRepository.deleteItem(id)

    return this.list(listId)
  }
})
