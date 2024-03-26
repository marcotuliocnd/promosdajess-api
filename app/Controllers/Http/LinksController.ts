import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import CreateLinkValidator from 'App/Validators/CreateLinkValidator'
import Link from 'App/Models/links'
import Database from '@ioc:Adonis/Lucid/Database'

export default class LinksController {
  async create({ request, response }: HttpContextContract): Promise<void> {
    const { title, link, isFixed = false, index = 99 } = await request.validate(CreateLinkValidator)
    try {
      const createdLink = await Link.create({ title, link, isFixed, index })
      return response.ok(createdLink)
    } catch (error) {
      Logger.error(error.message)
      return response.internalServerError({
        errors: [{ message: 'Internal Server Error' }],
      })
    }
  }

  async destroy({ request, response }: HttpContextContract): Promise<void> {
    const { link } = request.params()
    try {
      const foundLink = await Link.findBy('id', link)
      if (!foundLink) {
        return response.notFound({
          errors: [{ message: 'Link not found' }],
        })
      }
      await foundLink.delete()
      return response.noContent()
    } catch (error) {
      Logger.error(error.message)
      return response.internalServerError({
        errors: [{ message: 'Internal Server Error' }],
      })
    }
  }

  async read({ request, response }: HttpContextContract): Promise<void> {
    const { onlyFixed, page = 1, limit = 10 } = request.qs()
    try {
      const links = await Database.from('links')
        .where((builder) => {
          if (onlyFixed === 'true') {
            builder.where('is_fixed', true)
          }

          if (onlyFixed === 'false') {
            builder.where('is_fixed', false)
          }
        })
        .orderBy('created_at', 'desc')
        .paginate(page, limit)
      return response.ok(links)
    } catch (error) {
      Logger.error(error.message)
      return response.internalServerError({
        errors: [{ message: 'Internal Server Error' }],
      })
    }
  }

  async update({ request, response }: HttpContextContract): Promise<void> {
    const { title, link, isFixed, index } = request.body()
    const { id } = request.params()
    try {
      const updateObject: any = {}

      if (title) updateObject.title = title
      if (link) updateObject.link = link
      if (isFixed !== null && isFixed !== undefined) updateObject.isFixed = isFixed
      if (index !== null && index !== undefined) updateObject.index = index

      const updatedLink = await Link.updateOrCreate({ id }, updateObject)
      return response.ok(updatedLink)
    } catch (error) {
      Logger.error(error.message)
      return response.internalServerError({
        errors: [{ message: 'Internal Server Error' }],
      })
    }
  }
}
