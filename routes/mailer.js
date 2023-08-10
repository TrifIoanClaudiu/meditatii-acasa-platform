const router = require("express").Router();
const Profesor = require("../models/Profesor");
const User = require("../models/User");
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: '7d7b717e0af9d91683e04cc8f73438bf-6d1c649a-867336ff', domain: 'sandboxc4ef42f6b59741ae9e4981775e4af453.mailgun.org' });
const sender = "arnoldnagy25@gmail.com"

//Send emails
router.post('/', async (req, res) => {
    const {
        userId,
        profesorId
    } = req.body;

    try{
        const user = await User.findById(userId);
        const profesor = await Profesor.findById(profesorId);
        const { prenume:prenumeUser , nume: numeUser, email:userEmail } = user;
        const { email: profesorEmail, nume: numeProfesor } = profesor;

        sendUserMail(userEmail, prenumeUser, numeProfesor);
        sendProfesorEmail(profesorEmail, numeUser, prenumeUser, userEmail);

        res.status(200).json(true);
    }catch(err) {
        res.status(400).json(false);
    }
})

function sendUserMail(email, prenume, numeProfesor) {
    const data = {
      from: sender,
      to: email,
      subject: 'Meditații acasă',
      html: `<p style="font-size: 16px;">Salut ${prenume}.<br>Am primit cererea ta pentru meditatii cu ${numeProfesor} și vei primi un răspuns în cel mai scurt timp.
      <br>Dacă acest email a ajuns la tine din greșeală te rog să ne apelezi la: 0744204966</p>`,
    };
  
    mg.messages().send(data, (error, body) => {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Email sent successfully!');
      }
    });
  }
  
  function sendProfesorEmail(email, nume, prenume, emailUser) {
    const data = {
      from: sender,
      to: email,
      subject: 'Meditații acasă',
      html: `<p style="font-size: 16px;">Bună ziua.<br>Ați primit o cerere de meditații de la ${prenume} ${nume}, vă rog să îl contactați cât de curând pe email-ul: ${emailUser}</p>`,
    };
  
    mg.messages().send(data, (error, body) => {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Email sent successfully!');
      }
    });
  }
  

module.exports = router;