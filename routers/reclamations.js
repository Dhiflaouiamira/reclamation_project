const express = require('express');
const Reclamation = require('../models/Reclamation');
const User = require('../models/User'); // Import the User model
const auth = require ('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// GET all reclamations
router.get('/', (req, res) => {
    Reclamation.find()
        .exec()
        .then(reclamations => res.send(reclamations))
        .catch(err => res.status(400).send());
});

// GET all reclamations
router.get('/', (req, res) => {
    Reclamation.find({userId: req.params.userId})
        .exec()
        .then(reclamations => res.send(reclamations))
        .catch(err => res.status(400).send());
});

// GET all reclamations for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('reclamations');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user.reclamations);
    } catch (error) {
        console.error('Error fetching reclamations for the user:', error);
        res.status(500).send('Internal Server Error');
    }
});

function encryptReclamation(reclamation,key) {
    const iv = crypto.randomBytes(16);

    const encryptionKey =
      "98232bac1c8ecb4af5c704a6636c671da65bde195e5ef38bbe1b6feadd60e3f0";
    const cipher = crypto.createCipher("aes-256-cbc", encryptionKey, Buffer.from(key, 'hex'), iv);
    let encryptedReclamation = cipher.update(reclamation, "utf8", "hex");
    encryptedReclamation += cipher.final("hex");
    return {
        iv: iv.toString('hex'),

        encryptedReclamation
    }
  }

// POST a reclamation for a specific user
router.post('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { titre, description } = req.body;

    try {
        const encryptedTitre = encryptReclamation(titre, 'votre_clé_secrète');
        const encryptedDescription = encryptReclamation(description, 'votre_clé_secrète');

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newReclamation = new Reclamation({
            titre: encryptedTitre.encryptedReclamation, // Utilisez la propriété `encryptedReclamation`
            description: encryptedDescription.encryptedReclamation, // Utilisez la propriété `encryptedReclamation`
            user: userId,
        });

        // Ajoutez la réclamation à la liste des réclamations de l'utilisateur
        user.reclamations.push(newReclamation);

        await user.save(); // Sauvegardez l'utilisateur avec la nouvelle réclamation

        // Sauvegardez la réclamation séparément si nécessaire
        await newReclamation.save();

        res.status(201).json(newReclamation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la réclamation" });
    }
});
//POST
router.post('/', (req, res) => {
    const newReclamation =   new Reclamation(req.body);
    newReclamation.save()
      .then(reclamation => res.send(newReclamation))
      .catch(err => res.status(400).send(err));
  });


  
// GET a reclamation by ID
router.get('/:id', (req, res) => {
    Reclamation.findById(req.params.id)
        .then(reclamation => {
            if (!reclamation) {
                res.status(404).send('Reclamation not found');
            } else {
                res.send(reclamation);
            }
        })
        .catch(err => res.status(400).send(err));
});

// PUT update a reclamation
router.put('/:id', (req, res) => {
    Reclamation.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(reclamation => {
            if (!reclamation) {
                res.status(404).json({ error: 1 });
            } else {
                res.send(reclamation);
            }
        })
        .catch(err => res.status(400).send(err));
});

// DELETE a reclamation
router.delete('/:id', (req, res) => {
    Reclamation.findByIdAndDelete(req.params.id)
        .exec()
        .then(result => res.status(204).send())
        .catch(err => res.status(404).json(err));
});





module.exports = router;
