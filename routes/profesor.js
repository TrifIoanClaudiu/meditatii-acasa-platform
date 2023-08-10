const router = require("express").Router();
const Profesor = require("../models/Profesor");
const User = require("../models/User");

//Create teacher
router.post("/create", async (req, res) => {
    const { nume, materie, email, localitate, pret, zileDisponibile, img } = req.body;
  
    try {
      const newTeacher = new Profesor({
        nume,
        email,
        localitate,
        materie,
        pret,
        zileDisponibile,
        img
      });
  
      const savedTeacher = await newTeacher.save();
      res.status(200).json(savedTeacher);
    } catch (err) {
      res.status(500).json(err);
    }
});

//Get teacher by id

router.get("/:id", async (req, res) => {
    try {
      const profesor = await Profesor.findById(req.params.id);
      if (!profesor) {
        return res.status(404).json("Teacher has not been found");
      }

      const { email, ...others } = profesor._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(400).json(err);
    }
});

//Get all or get by discipline
router.get('/', async (req, res) => {
  const { localitate, materie, searchQuery } = req.query;
  const query = { localitate };

  if (materie) { 
    query.materie = materie;
  }

  if (searchQuery) {
    const searchTerms = searchQuery.split(/\s+/);
    const namePartsRegex = searchTerms.map(term => `(?=.*\\b${term})`); 
    query.nume = { $regex: `${namePartsRegex.join('')}`, $options: 'i' }; 
  }

  try {
    const teachers = await Profesor.find(query);
    res.json(teachers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;