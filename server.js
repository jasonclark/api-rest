const express = require('express');
const compression = require('compression');
const Joi = require('joi'); //used for validation
const app = express();
//Use node.js json middleware 
app.use(express.json());
//Make Express pass '2' as the 3rd argument to `JSON.stringify()`
app.set('json spaces', 2);
//Compress all HTTP responses using node.js compression middleware
//app.use(compression());
app.use(compression({
  filter: function () { return true; }
}));

const resources = require('./resources.json');

//READ Request Handlers
/*
route = /api/resources
action = GET: retrieve and list all resources
*/
app.get('/api/resources', (req, res)=> {
  let limit = req.query.limit || 10;
  res.status(200).json(resources.slice(0,limit));
});

//READ Request Handler for searching resources and returning matches
/*
route = /api/resources/search?q=ADD-QUERY-HERE
action = GET: search and retrieve resources by matching string in text field
*/
app.get('/api/resources/search', (req, res) => {
//app.get('/api/resources/search/:q', (req, res) => {
  //let q = req.params.q;
  let q = req.query.q;
  const results = resources.filter(item => new RegExp(q, "i").test(item.text));
  if (!results) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource.</h2>');
  res.status(200).json(results);
});

//READ Request Handler for single resource using id and regex validating that id is a number
/*
route = /api/resource/id
action = GET: find and retrieve resource by id
*/
app.get('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find(item => item.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource.</h2>');
  res.status(200).json(resource);
});
 
//READ Request Handler for retrieving single random resource
/*
route = /api/resource/random
action = GET: retrieve random single resource
*/
app.get('/api/resource/random', (req, res) => {
  let values = Object.values(resources);
  const randomResource = values[parseInt(Math.random() * values.length)];
  if (!randomResource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource.</h2>');
  let format = req.query.format;
  if (format === "text") {
    let textResource = randomResource.text;
    res.status(200).send(textResource);
  } else {
    res.status(200).json(randomResource);
  }
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
  res.status(200).json(resource);
});
 
//UPDATE Request Handler for single resource using id and regex validating that id is a number
/*
route = /api/resource/id
action = PUT: retrieve and update resource by id
*/
app.put('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find(item => item.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource to update.</h2>');
  const { error } = validateResource(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  resource.text = req.body.text;
  res.status(200).json(resource);
});
 
//DELETE Request Handler for single resource using id and regex validating that id is a number
/*
route = /api/resource/id
action = DELETE: retrieve and delete resource by id
*/
app.delete('/api/resource/:id([0-9]+)', (req, res) => {
  const resource = resources.find(item => item.id === req.params.id);
  if (!resource) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Could not find that resource to delete.</h2>');
  const index = resources.indexOf(resource);
  resources.splice(index,1);
  res.status(200).json(resource);
});
 
function validateResource(resource) {
  const schema = {
    text: Joi.string().min(3).required()
  };
  return Joi.validate(resource, schema);
}

//Default READ Request Handler route and index page 
app.get('*', (req, res) => {
  res.status(200).sendFile('./index.html', { root: __dirname });
}); 

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
