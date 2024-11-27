@@ -1,7 +1,7 @@
const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

const Orders=require('./orders')
/**
 * Handle the root route
 * @param {object} req
@@ -50,8 +50,8 @@ async function getProduct(req, res, next) {
 * @param {object} res 
 */
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
   const product = await Products.create(req.body)
  res.json(product)
}

/**
@@ -61,8 +61,9 @@ async function createProduct(req, res) {
 * @param {function} next
 */
async function editProduct(req, res, next) {
  console.log(req.body)
  res.json(req.body)
 const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}

/**
@@ -72,7 +73,56 @@ async function editProduct(req, res, next) {
 * @param {*} next 
 */
async function deleteProduct(req, res, next) {
  res.json({ success: true })
  const response = await Products.destroy(req.params.id)
  res.json(response)
}

/**
 * Create an order
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function createOrder(req, res, next) {
  const order = await Orders.create(req.body)
  res.json(order)
}

async function editOrder(req, res, next) {
 const change = req.body
  const order = await Orders.edit(req.params.id, change)
  res.json(order)
}

/**
 * Delete a order
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function deleteOrder(req, res, next) {
  const response = await Orders.destroy(req.params.id)
  res.json(response)
}


/**
 * List orders
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function listOrders(req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({ 
    offset: Number(offset), 
    limit: Number(limit),
    productId, 
    status 
  })

  res.json(orders)
}

module.exports = autoCatch({
@@ -81,5 +131,9 @@ module.exports = autoCatch({
  getProduct,
  createProduct,
  editProduct,
  deleteProduct
  deleteProduct,
  createOrder,
  listOrders,
  editOrder,
  deleteOrder
});
