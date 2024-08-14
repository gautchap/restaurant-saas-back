/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
const StripeController = () => import('#controllers/stripe_controller')
const BookingsController = () => import('#controllers/bookings_controller')
const AuthController = () => import('#controllers/auth_controller')
const ItemsController = () => import('#controllers/items_controller')

router.post('auth/signup', [AuthController, 'signUp'])
router.post('auth/send-mail', [AuthController, 'sendMail'])
router.get('auth/signup-mail', [AuthController, 'signUpWithToken'])
router.get('auth/me', [AuthController, 'getInfos'])
router.post('auth/exist', [AuthController, 'userExist'])
router.get('auth/signout', [AuthController, 'signOutUser'])

router.get('items/get', [ItemsController, 'getItems'])
router.put('items/update', [ItemsController, 'updateItems'])
router.delete('items/delete', [ItemsController, 'deleteItem'])

router.post('bookings/create/public', [BookingsController, 'createBookingWithoutAuth'])
router.post('bookings/create/private', [BookingsController, 'createBookingWithAuth'])
router.get('bookings/get', [BookingsController, 'getBookings'])

router.post('webhook/stripe/payment', [StripeController, 'postPayment'])
router.get('products', [StripeController, 'getProducts'])
router.get('invoices', [StripeController, 'getInvoices'])

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})
