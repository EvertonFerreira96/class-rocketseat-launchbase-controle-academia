const fs = require('fs');
const data = require('../data.json');
const { getAge } = require('../utilities/date');
const Intl = require('intl');

module.exports = {

   indexInstructor(req, res) {
      const instructors = data.instructors;
      return res.render('instructors/index', { instructors })
   },

   showInstructor(req, res) {

      const { id } = req.params;
      const foundInstructor = data.instructors.find((instructor) => instructor.id == id);

      if (!foundInstructor) return res.send('Instructor not found!');

      const age = getAge(foundInstructor.birth);


      const instructor = {
         ...foundInstructor,
         age,
         services: foundInstructor.services.split(','),
         createdAt: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.createdAt)
      }
      return res.render('instructors/show', { instructor })
   },

   editInstructor(req, res) {
      const { id } = req.params;
      const foundInstructor = data.instructors.find((instructor) => instructor.id == id);

      if (!foundInstructor) return res.send('Instructor not found!');

      const age = getAge(foundInstructor.birth);
      const birth = new Intl.DateTimeFormat('sv-SE', { timeZone: 'UTC' }).format(foundInstructor.birth);
      const instructor = {
         ...foundInstructor,
         age,
         birth,
         services: foundInstructor.services.split(',')
      }
      return res.render('instructors/edit', { instructor })
   },

   storeInstructor(req, res) {
      const keys = Object.keys(req.body);
      for (key of keys) {
         if (!req.body[key]) return res.json({ message: 'error' })
      }

      req.body.birth = Date.parse(req.body.birth);
      const { avatarUrl, name, birth, gender, services, } = req.body;

      id = Number(data.instructors.length + 1);
      createdAt = Date.now();
      data.instructors.push(
         {
            id
            , avatarUrl
            , name
            , birth
            , gender
            , services
            , createdAt
         })
      fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
         return err ? res.send('Write file Error') : res.redirect(`instructors/${id}`);
      });
   },

   updateInstructor(req, res) {
      const  id  = Number(req.body.id);
      req.body.birth = Date.parse(req.body.birth);
      let index = -1;

      const foundInstructor = data.instructors.find((instructor, foundIndex) => {

         if (instructor.id == id) {
            index = foundIndex;
            return true
         }
      });

      if (!foundInstructor) return res.send('Instructor not found!');

      const instructor = {
         ...foundInstructor,
         ...req.body,
         id,
      }
      data.instructors[index] = instructor;
      fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
         return err ? res.send('Write file Error') : res.redirect(`instructors/${id}`);

      });


   },

   deleteInstructor(req, res) {
      const { id } = req.body;
      req.body.birth = Date.parse(req.body.birth);

      const dataFilterInstructors = data.instructors.filter((instructor ) => instructor.id != id);
      
      data.instructors = dataFilterInstructors;
      fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
         return err ? res.send('Write file Error') : res.redirect(`instructors/`);

      });


   },
}