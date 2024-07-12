import Item from '#models/item'
import User from '#models/user'

type UpdateItemProps = Pick<Item, 'id' | 'userId' | 'type' | 'x' | 'y'>
type DeleteItems = Pick<Item, 'id'>

export default class ItemService {
  async getItems(userId: User['id']) {
    const user = await User.findOrFail(userId)
    const items = await user.related('items').query()

    return items
  }

  async deleteItem(items: DeleteItems[]) {
    items.forEach(async (item) => {
      await Item.query().where('id', item.id).delete()
    })

    return { status: 'deleted successfully' }
  }

  async updateItems(items: UpdateItemProps[]) {
    const updatedItems = await Item.updateOrCreateMany(['id', 'userId'], items)

    return updatedItems
  }
}
