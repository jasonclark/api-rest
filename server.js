const express = require('express');
const Joi = require('joi'); //used for validation
const app = express();
app.use(express.json());
//Make Express pass '2' as the 3rd argument to `JSON.stringify()`
app.set('json spaces', 2);

const resources = [
{"id": "1", "creator": "A Tribe Called Quest", "text": "Vo-cab-u-lary's necessary when digging into my library"},
{"id": "2", "creator": "A Tribe Called Quest", "text": "Well, then grab the microphone and let your words rip"},
{"id": "3", "creator": "A Tribe Called Quest", "text": "You on point Tip? Yo, all the time, Phife"},
{"id": "4", "creator": "A Tribe Called Quest", "text": "Back in the days when I was a teenager before I had status and before I had a pager"},
{"id": "5", "creator": "A Tribe Called Quest", "text": "Talk to Joey, Earl, Kendrick, and Cole, gatekeepers of flow"}
]
 
//READ Request Handlers
/*
route = /api/resources
action = GET: retrieve and list all resources
*/
app.get('/api/resources', (req,res)=> {
  res.json(resources);
});

//READ Request Handler for searching resources and returning matches
/*
route = /api/resources/search?q=ADD-QUERY-HERE
action = GET: search and retrieve resources by matching string in text field
*/
app.get('/api/resources/search', (req, res) => {
//app.get('/api/resources/search/:q', (req, res) => {
  //let q = req.params.q;
  let q = req.query.q
  const results = resources.filter(it => new RegExp(q, "i").test(it.text));
  if (!results) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource.</h2>');
  res.json(results);
});

//READ Request Handler for single resource using id and regex validating that id is a number
/*
route = /api/resource/id
action = GET: find and retrieve resource by id
*/
app.get('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find(c => c.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource.</h2>');
  res.json(resource);
});
 
//CREATE Request Handler
/*
route = /api/resources
action = POST: creates a new resource
*/
app.post('/api/resources', (req, res)=> {
  const { error } = validateResource(req.body);
  if (error) {
    res.status(400).send(error.details[0].message)
  return;
  }
  const resource = {
    id: resources.length + 1,
    creator: req.body.creator,
    text: req.body.text
  };
  resources.push(resource);
  res.json(resource);
});
 
//UPDATE Request Handler for single resource using id and regex validating that id is a number
/*
route = /api/resource/id
action = PUT: retrieve and update resource by id
*/
app.put('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find(c=> c.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource to update.</h2>');
  const { error } = validateResource(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  resource.text = req.body.text;
  res.json(resource);
});
 
//DELETE Request Handler for single resource using id and regex validating that id is a number
/*
route = /api/resource/id
action = DELETE: retrieve and delete resource by id
*/
app.delete('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find( c=> c.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource to delete.</h2>');
  const index = resources.indexOf(resource);
  resources.splice(index,1);
  res.json(resource);
});
 
function validateResource(resource) {
  const schema = {
    text: Joi.string().min(3).required()
  };
  return Joi.validate(resource, schema);
}

//Default READ Request Handler route and index page 
app.get('*', (req, res) => {
  res.sendFile('./index.html', { root: __dirname });
}); 

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
