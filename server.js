const express = require('express');
const Joi = require('joi'); //used for validation
const app = express();
app.use(express.json());
 
const resources = [
{"id": "1", "creator": "A Tribe Called Quest", "text": "Vo-cab-u-lary's necessary when digging into my library"},
{"id": "2", "creator": "A Tribe Called Quest", "text": "Well, then grab the microphone and let your words rip"},
{"id": "3", "creator": "A Tribe Called Quest", "text": "You on point Tip? Yo, all the time, Phife"},
{"id": "4", "creator": "A Tribe Called Quest", "text": "Back in the days when I was a teenager before I had status and before I had a pager"},
{"id": "5", "creator": "A Tribe Called Quest", "text": "Talk to Joey, Earl, Kendrick, and Cole, gatekeepers of flow"}
]
 
//READ Request Handlers
app.get('/api/', (req, res) => {
  res.send('<h1>Welcome to an example REST API for teaching and learning.</h1><p>This sample API uses A Tribe Called Quest lyrics.</p>');
});
 
app.get('/api/resources', (req,res)=> {
  res.send(resources);
});

//Read Request Handler for single resource using id and regex validating that id is a number
app.get('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find(c => c.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource.</h2>');
  res.send(resource);
});
 
//CREATE Request Handler
app.post('/api/resource', (req, res)=> {
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
  res.send(resource);
});
 
//UPDATE Request Handler for single resource using id and regex validating that id is a number
app.put('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find(c=> c.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource to update.</h2>');
  const { error } = validateResource(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  resource.text = req.body.text;
  res.send(resource);
});
 
//DELETE Request Handler for single resource using id and regex validating that id is a number
app.delete('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find( c=> c.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource to delete.</h2>');
  const index = resources.indexOf(resource);
  resources.splice(index,1);
  res.send(resource);
});
 
function validateResource(resource) {
  const schema = {
    text: Joi.string().min(3).required()
  };
  return Joi.validate(resource, schema);
}
 
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
