import type { HttpContext } from '@adonisjs/core/http'
import {
  createUserValidator,
  readUserValidator,
  signUpConfirmationValidator,
} from '#validators/auth_validator'
import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'

@inject()
export default class AuthController {
  constructor(protected userService: UserService) {}
  async signUp({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createUserValidator.validate(data)

    const user = await this.userService.signUser(payload)

    response.status(200).send(user)

    return user
  }
  async sendMail({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createUserValidator.validate(data)

    const user = await this.userService.sendUserAuthMail(payload)

    response.status(200).send(user)

    return user
  }

  async signUpWithToken({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')

    const data = request.all()

    const payload = await signUpConfirmationValidator.validate(data)

    const userConfirmed = await this.userService.signUserAuthMail({
      token: payload.token,
      email: user.email,
    })

    return userConfirmed
  }
  async getInfos({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')

    return user
  }
  async userExist({ request }: HttpContext) {
    const data = request.all()
    const payload = await readUserValidator.validate(data)

    const user = await this.userService.userExist(payload.id)
    return user
  }

  async signOutUser({ response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (!user) return response.status(401).send('Unauthorized')

    const signOut = await this.userService.signOutUser({
      userId: user.id,
      token: user.currentAccessToken,
    })

    return signOut
  }
}
