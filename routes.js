const express = require('express');
const routes = express.Router();

const { deleteInstructor, editInstructor, indexInstructor, storeInstructor, showInstructor, updateInstructor } = require('./controllers/instructor')
const { deleteMembers, editMembers, indexMembers, storeMembers, showMembers, updateMembers } = require('./controllers/members')

routes.get('/', (req, res) => res.redirect('/instructors'));

routes.get('/instructors', indexInstructor);
routes.get('/instructors/create', (req, res) => res.render('instructors/create'));
routes.post('/instructors', storeInstructor);
routes.delete('/instructors', deleteInstructor)
routes.put('/instructors', updateInstructor);
routes.get('/instructors/:id', showInstructor);
routes.get('/instructors/:id/edit', editInstructor);

routes.get('/members', indexMembers);
routes.get('/members/create', (req, res) => res.render('members/create'));
routes.post('/members', storeMembers);
routes.put('/members', updateMembers);
routes.delete('/members', deleteMembers)
routes.get('/members/:id', showMembers);
routes.get('/members/:id/edit', editMembers);


routes.use((req,res) => res.status(404).render('about/index'))

module.exports = routes;