import type { AccessToken } from '@adonisjs/auth/access_tokens'
import User from '#models/user'

type UserPayload = {
  name: string
  email: string
}

export default class UserService {
  async signUser({ name, email }: UserPayload) {
    const user = await User.firstOrCreate(
      { email },
      {
        name,
        email,
      }
    )

    const token = await User.accessTokens.create(user)
    return { user, accessToken: token.value!.release() }
  }

  async sendUserAuthMail({ name, email }: UserPayload) {
    const user = await User.firstOrCreate({ email }, { name, email })

    const token = await User.accessTokens.create(user)
    return { user, accessToken: token.value!.release() }
  }

  async signUserAuthMail({ token, email }: { token: string; email: string }) {
    const user = await User.updateOrCreate({ email }, { email })

    return { user, accessToken: token }
  }

  async userExist(id: string) {
    const user = await User.find(id)
    return user
  }

  async signOutUser({
    user,
  }: {
    user: User & {
      currentAccessToken: AccessToken
    }
  }) {
    const signOut = await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return signOut
  }
}
