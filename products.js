@@ -1,8 +1,39 @@
const fs = require('fs').promises
const path = require('path')
const cuid = require('cuid')

const db = require('./db')

const productsFile = path.join(__dirname, 'data/full-products.json')

// Define our Product Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }], 
})


/**
 * List products
 * @param {*} options 
@@ -12,38 +43,67 @@ async function list(options = {}) {

  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
    .filter(product => {
      if (!tag) {
        return product
   // the query object to Mongoose to filter the products
  const query = tag ? {
    tags: {
      $elemMatch: {
        title: tag
      }
    }
  } : {}

      return product.tags.find(({ title }) => title == tag)
    })
    .slice(offset, offset + limit) // Slice the products
  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return products
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
async function get(_id) {

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }
  const product = await Product.findById(_id)
  return product

}

  // If no product is found, return null
  return null;
async function create (fields) {
  const product = await new Product(fields).save()
  return product
}

/**
 * Edit a product  
 * @param {String} _id
 * @param {Object} change
 * @returns {Promise<Object>}
 */
async function edit (_id, change) {
  const product = await get(_id)

  // todo can we use spread operators here?
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })

  await product.save()

  return product
}

async function destroy (_id) {
  return await Product.deleteOne({_id})
}

module.exports = {
  list,
  create,
  edit,
  destroy,
  get
}
}