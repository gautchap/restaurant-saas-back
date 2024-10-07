import type { AccessToken } from '@adonisjs/auth/access_tokens'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import sendMailConfirmation from '#resources/views/emails/auth_email'

type UserPayload = {
  name: string
  email: string
  provider: string
}
type UserPayloadWithProduct = {
  customerId: string
  priceId: string
  plan: 0 | 1
} & UserPayload

export default class UserService {
  async signUser({ name, email, provider }: UserPayload) {
    const user = await User.firstOrCreate(
      { email },
      {
        name,
        email,
        provider,
      }
    )

    const token = await User.accessTokens.create(user)
    user.customerId = user.customerId || null
    user.priceId = user.priceId || null
    user.plan = user.plan || 0
    return { user, accessToken: token.value!.release() }
  }

  async sendUserAuthMail({ name, email, provider }: UserPayload) {
    const user = await User.firstOrCreate({ email }, { name, email, provider })

    const token = await User.accessTokens.create(user)

    await mail
      .send((message) => {
        message
          .to(user.email)
          .subject('Se connecter à votre compte')
          .html(sendMailConfirmation(token.value!.release()))
      })
      .then(() => console.log('email sent'))
    user.customerId = user.customerId || null
    user.priceId = user.priceId || null
    user.plan = user.plan || 0
    return { user, accessToken: token.value!.release() }
  }

  async sendUserAuthMailWithProduct({
    name,
    email,
    provider,
    customerId,
    priceId,
    plan,
  }: UserPayloadWithProduct) {
    const user = await User.firstOrCreate(
      { email },
      { name, email, provider, customerId, priceId, plan }
    )

    const token = await User.accessTokens.create(user)

    await mail
      .send((message) => {
        message
          .to(user.email)
          .subject('Se connecter à votre compte')
          .html(sendMailConfirmation(token.value!.release()))
      })
      .then(() => console.log('email sent'))
    return { user, accessToken: token.value!.release() }
  }

  async signUserAuthMail({ token, email }: { token: string; email: string }) {
    const user = await User.updateOrCreate({ email }, { email })

    user.customerId = user.customerId || null
    user.priceId = user.priceId || null
    user.plan = user.plan || 0

    return { user, accessToken: token }
  }

  async userExist(id: string) {
    const user = await User.find(id)
    return user
  }

  async findUser(query: keyof User, element: string) {
    const user = await User.findBy(query, element)
    return user
  }

  async signOutUser({ userId, token }: { userId: User['id']; token: AccessToken }) {
    const user = await User.findBy('id', userId)
    if (!user) return 'User not found'
    const signOut = await User.accessTokens.delete(user, token.identifier)

    return signOut
  }
}
