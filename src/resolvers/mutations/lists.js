module.exports = `
  createList (
    name: String
  ) : List

  updateList (
    id: Int,
    name: String
  ) : List

  deleteList (
    id: Int
  ) : List

  addListItem (
    listId: Int,
    text: String
  ) : List

  updateListItem (
    id: Int,
    text: String,
    done: Boolean
  ) : List

  deleteListItem (
    id: Int
  ) : List
`
