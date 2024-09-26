export default function sendMailConfirmation(token: string) {
  return `<a href='http://${process.env.HOST}:3000/api/cred/signup?token=${token}'>Confirm your email address</a>`
}
