const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    include: [
      {
        model: Product,
        attributes: ['product_name']
      }
    ]
  }) .then(result => {
    res.json(result);
  })
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findByPk(req.params.id, {
    include: [
      {
        model: Product,
        attributes: ['product_name']
      }
    ]
  }) .then(result => {
    res.json(result);
  }
  )
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  }) .then(result => {
    res.json(result);
  })
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: { 
      id: req.params.id
    }
  }) .then(result => {
    res.json(result);
  })
});

module.exports = router;
