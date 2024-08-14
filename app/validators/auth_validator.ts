import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    email: vine.string().trim().email(),
    provider: vine.string().trim().minLength(1),
  })
)

export const signUpConfirmationValidator = vine.compile(
  vine.object({
    token: vine.string().trim().minLength(1),
  })
)

export const readUserValidator = vine.compile(
  vine.object({
    id: vine.string().uuid().trim().minLength(1),
  })
)
