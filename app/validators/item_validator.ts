import vine from '@vinejs/vine'

export const getItemsValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid().trim().minLength(1),
  })
)

export const updateItemsValidator = vine.compile(
  vine.object({
    items: vine.array(
      vine.object({
        id: vine.string().trim().minLength(1),
        userId: vine.string().uuid().trim().minLength(1),
        type: vine.string().trim().minLength(1),
        name: vine.string().trim().minLength(1),
        shape: vine.string().trim().minLength(1),
        x: vine.number(),
        y: vine.number(),
      })
    ),
  })
)
