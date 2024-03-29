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
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then(result => res.json(result))
  .catch(err => res.status(500).json(err)); // Handle any errors
});


router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(result => {
    if (result[0] > 0) { // Check if any row was updated
      res.json({ message: 'Tag updated successfully.' });
    } else {
      res.status(404).json({ message: 'Tag not found.' });
    }
  })
  .catch(err => res.status(500).json(err)); // Handle any errors
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
