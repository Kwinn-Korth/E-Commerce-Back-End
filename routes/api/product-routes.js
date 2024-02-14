const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // TODO: find all products and be sure to include its associated Category and Tag data
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']
      }
    ]
  }) .then(result => {
    res.json(result);
  })
});

// get one product
router.get('/:id', (req, res) => {
  // TODO: find a single product by its `id` and be sure to include its associated Category and Tag data
  Product.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']
      }
    ]
  }) .then(result => {
    res.json(result);
  }
  )
});

// create new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, category_id, tagIds } = req.body;
    // Create the product
    const product = await Product.create({ product_name, price, stock, category_id });

    // Check if there are tag IDs provided
    if (tagIds && tagIds.length) {
      // Fetch existing tags to validate provided IDs
      const existingTags = await Tag.findAll({
        where: {
          id: tagIds
        }
      });

      // Filter to get an array of existing tag IDs
      const existingTagIds = existingTags.map(tag => tag.id);

      // Compare provided tagIds with existingTagIds to ensure all exist
      const allTagsExist = tagIds.every(tagId => existingTagIds.includes(tagId));

      if (!allTagsExist) {
        // Not all provided tag IDs exist in the database
        return res.status(400).json({ message: 'One or more provided tag IDs do not exist.' });
      }

      // All provided tag IDs exist; proceed to create product_tag associations
      const productTagIdArr = tagIds.map(tag_id => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Respond with the product (and associated tags if applicable)
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // TODO: delete one product by its `id` value
  Product.destroy({
    where: { 
      id: req.params.id
    }
  }) .then(result => {
    res.json(result);
  })
});

module.exports = router;
