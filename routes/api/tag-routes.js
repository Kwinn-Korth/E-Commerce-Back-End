const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // TODO: find all tags and be sure to include its associated Product data
  Tag.findAll({
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
  // TODO: find a single tag by its `id` and be sure to include its associated Product data
  Tag.findByPk(req.params.id, {
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
  // TODO: create a new tag
  Tag.create({
    tag_name: req.body.tag_name
  }) .then(result => {
    res.json(result);
  })
});

router.put('/:id', (req, res) => {
  // TODO: update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
});

router.delete('/:id', (req, res) => {
  // TODO: delete on tag by its `id` value
  Tag.destroy({
    where: { 
      id: req.params.id
    }
  }) .then(result => {
    res.json(result);
  })
});

module.exports = router;
