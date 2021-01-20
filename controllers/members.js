const fs = require('fs');
const data = require('../data.json');
const { getAge } = require('../utilities/date');
const Intl = require('intl');

module.exports = {

   indexMembers(req, res) {
      const members = data.members;
      return res.render('members/index', { members })
   },

   showMembers(req, res) {

      const { id } = req.params;
      const foundMember = data.members.find((member) => member.id == id);

      const birth = new Intl.DateTimeFormat('sv-SE', { timeZone: 'UTC' }).format(foundMember.birth);
      
      if (!foundMember) return res.send('member not found!');

      const age = getAge(foundMember.birth);


      const member = {
         ...foundMember,
         age,
         birth,
         createdAt: new Intl.DateTimeFormat('pt-BR').format(foundMember.createdAt)
      }
      return res.render('members/show', { member })
   },

   editMembers(req, res) {
      const { id } = req.params;
      const foundMember = data.members.find((member) => member.id == id);

      if (!foundMember) return res.send('member not found!');

      const age = getAge(foundMember.birth);
      const birth = new Intl.DateTimeFormat('sv-SE', { timeZone: 'UTC' }).format(foundMember.birth);
      const member = {
         ...foundMember,
         age,
         birth
      }
      return res.render('members/edit', { member })
   },

   storeMembers(req, res) {

      const keys = Object.keys(req.body);
      for (key of keys) {
         if (!req.body[key]) return res.json({ message: 'error' })
      }
      
      req.body.birth = Date.parse(req.body.birth);
      
      const { avatarUrl, name, email, birth, gender, blood, weight, height } = req.body;

      const id = data.members[data.members.length - 1].id ? Number(data.members[data.members.length - 1].id + 1) : 1;
      const createdAt = Date.now();

      data.members.push(
         {
              id
            , avatarUrl
            , name
            , email
            , birth
            , gender
            , blood
            , weight
            , height
            , createdAt
         })
      fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
         return err ? res.send('Write file Error') : res.redirect(`members/${id}`);
      });
   },

   updateMembers(req, res) {
      const  id  = Number(req.body.id);
      req.body.birth = Date.parse(req.body.birth.replace('-','/'));
      let index = -1;

      const foundMember = data.members.find((member, foundIndex) => {

         if (member.id == id) {
            index = foundIndex;
            return true
         }
      });

      if (!foundMember) return res.send('member not found!');

      const member = {
         ...foundMember,
         ...req.body,
         id,
      }
      data.members[index] = member;
      fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
         return err ? res.send('Write file Error') : res.redirect(`members/${id}`);

      });


   },
   
   deleteMembers(req, res) {
      const { id } = req.body;
      req.body.birth = Date.parse(req.body.birth);

      const dataFiltermembers = data.members.filter((member ) => member.id != id);
      
      data.members = dataFiltermembers;
      fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
         return err ? res.send('Write file Error') : res.redirect(`members/`);

      });


   },
}