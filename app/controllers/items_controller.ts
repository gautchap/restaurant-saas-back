import type { HttpContext } from '@adonisjs/core/http'
import ItemService from '#services/item_service'
import { inject } from '@adonisjs/core'
import { getItemsValidator, updateItemsValidator } from '#validators/item_validator'
import { cache } from '#config/cache'

@inject()
export default class ItemsController {
  constructor(protected itemService: ItemService) {}

  async getItems({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')

    const data = request.all()
    const payload = await getItemsValidator.validate(data)

    const items = await cache.getOrSet(
      `items:${payload.userId}`,
      async () => await this.itemService.getItems(payload.userId)
    )

    return items
  }
  async updateItems({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')

    const data = request.all()
    const payload = await updateItemsValidator.validate(data)

    const items = await this.itemService.updateItems(payload.items)

    response.status(200).send(items)

    const cachedItems = cache.namespace('items')
    await cachedItems.delete(user.id)
  }

  async deleteItem({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')

    const data = request.all()
    const payload = await updateItemsValidator.validate(data)

    const deleted = await this.itemService.deleteItem(payload.items)

    response.status(200).send(deleted)

    const cachedItems = cache.namespace('items')
    await cachedItems.delete(user.id)
  }
}
