import User from '#models/user'

export default class UserService {
  async signUser({ name, email }: { name: string; email: string }) {
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

  async userExist(id: string) {
    const user = await User.find(id)
    return user
  }
}
