import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register').middleware('auth')
  Route.post('/login', 'AuthController.login')
}).prefix('auth')

Route.group(() => {
  Route.post('/', 'LinksController.create').middleware('auth')
  Route.delete('/:link', 'LinksController.destroy').middleware('auth')
  Route.patch('/:id', 'LinksController.update').middleware('auth')
  Route.get('/', 'LinksController.read')
}).prefix('links')
