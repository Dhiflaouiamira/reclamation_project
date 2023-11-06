const express = require('express');
const User = require('../models/User');
const auth = require ('../middleware/auth');


const router = express.Router();



//GET
router.get('/', (req, res) => {
  User.find()
    .then(users => res.send(users))
    .catch(err => res.status(400).send(err));
});


//POST
router.post('/', (req, res) => {
  const newUser =   new User(req.body);
  newUser.save()
    .then(user => res.send(newUser))
    .catch(err => res.status(400).send(err));
});


//GET ID
router.get('/:id',auth, (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) res.status(404).send();
      else res.send(user);
    })
    .catch(err => res.status(400).send(err));
});



//PUT
router.put('/:id',(req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => {
      if (!user) res.status(404).json({ error: 1 });
      else res.send(user);
    })
    .catch(err => res.status(400).send(err));
});

//DELETE

router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).send())
    .catch(err => res.status(404).json(err));
});

module.exports = router;