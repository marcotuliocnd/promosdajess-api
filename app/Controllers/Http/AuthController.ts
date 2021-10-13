import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/users'
import RegisterValidator from 'App/Validators/RegisterValidator'
import LoginValidator from 'App/Validators/LoginValidator'

export default class AuthController {
  async register({ request, response }: HttpContextContract): Promise<void> {
    const { email, password } = await request.validate(RegisterValidator)

    Logger.info(`Creating user: ${email}`)

    try {
      const user = await User.create({
        email,
        password,
      })

      const userJson = user.toJSON()
      delete userJson.password
      return response.json(userJson)
    } catch (error) {
      Logger.error(error.message)
      return response.internalServerError({
        errors: [{ message: 'Internal Server Error' }],
      })
    }
  }

  async login({ request, response, auth }: HttpContextContract): Promise<void> {
    const { email, password } = await request.validate(LoginValidator)

    Logger.info(`Login user: ${email}`)

    try {
      const user = await User.findBy('email', email)

      if (!user) {
        return response.notFound({
          errors: [{ message: 'User not found' }],
        })
      }

      const token = await auth.attempt(email, password)

      return response.json({ user, token })
    } catch (error) {
      Logger.error(error.message)
      return response.internalServerError({
        errors: [{ message: error.message }],
      })
    }
  }
}
