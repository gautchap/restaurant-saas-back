import vine from '@vinejs/vine'

export const getItemsValidator = vine.compile(
  vine.object({
    userId: vine.number(),
  })
)

export const updateItemsValidator = vine.compile(
  vine.object({
    items: vine.array(
      vine.object({
        id: vine.string().trim().minLength(1),
        userId: vine.number(),
        type: vine.string().trim().minLength(1),
        name: vine.string().trim().minLength(1),
        shape: vine.string().trim().minLength(1),
        x: vine.number(),
        y: vine.number(),
      })
    ),
  })
)
