const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

function readFile(path){
  var fileContent = fs.readFileSync(path, "utf-8");
  return fileContent;
}

function writeFile(path, data){
  fs.writeFileSync(path, data);
}


// endpoint 
// responde a um pedido HTTP GET
// 1º é a rota/path do endpoint
// 2º é o código que vai ser executado quando
// este endpoint for invocado
app.get('/hello/test', function(request, response) {
    response.send('Hello World!');}
)

app.get('/users', function(request, response) {
  response.send(personsObject);
});

app.delete('/users/:id', function(request, response) {
  var id = request.params.id;
  var person = personsObject["person" + id];

  if(person == undefined){
    response.send("This id does not exist!");
  }
  else{
    delete personsObject["person" + id];
    writeFile("./persons.json", JSON.stringify(personsObject));
    response.send("This id "+ id +" was deleted");
  }
});


app.get('/users/:id', function(request, response) {
  var id = request.params.id;
  var person = personsObject["person" + id];

  if(person == undefined){
    response.send("This id does not exist!");
  }
  else{    
    response.send(person);
  }
});


app.put('/users/:id', (request, response)=>{
  
  var id = request.params.id;

  var personFromBody = request.body;
  var person = personsObject['person' + id];

  if(person != undefined){
    personFromBody.id = id;
    personsObject['person' + id] = personFromBody;
    response.send(personFromBody);
  }
  else{
    response.send("ID does not exist");
  }  
})



app.post('/users', function(request, response) {

  // person que vem no body do pedido
  var person = request.body;
  // selecionar as chaves num array e obter o seu tamanho
  var size = Object.keys(personsObject).length;
  // incrementar 1 valor
  size++;
  // atribuir o id igual ao tamanho + 1
  person.id = size;
  // criar uma nova chave por ex: person6 que terá o valor da person que vem no body
  personsObject['person' + person.id] = person;

  writeFile("./persons.json", JSON.stringify(personsObject));

  // enviar o id da pessoa que foi inserida
  response.send(person.id + "");
});



var personsString = readFile('./persons.json');
var personsObject = JSON.parse(personsString);