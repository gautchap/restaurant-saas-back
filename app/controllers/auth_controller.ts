import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, readUserValidator } from '#validators/auth_validator'
import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'

@inject()
export default class AuthController {
  constructor(protected userService: UserService) {}
  async signUp({ request }: HttpContext) {
    const data = request.all()
    const payload = await createUserValidator.validate(data)

    const user = await this.userService.signUser({ name: payload.name, email: payload.email })
    return user
  }
  async getInfos({ auth }: HttpContext) {
    const user = await auth.authenticate()
    if (user) return user

    return 'No user found'
  }
  async userExist({ request }: HttpContext) {
    const data = request.all()
    const payload = await readUserValidator.validate(data)

    const user = await this.userService.userExist(payload.id)
    return user
  }
}
