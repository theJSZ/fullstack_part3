const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

const omaToken = morgan.token('body', (request, response) => {
  return (
    JSON.stringify(request.body)
  )
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// app.use(requestLogger)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }
]

app.get('/api/persons', (request, result) => {
  result.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (persons.find(p => p.name === person.name)) {
    response.status(400).send({ error: 'name must be unique' })
  }

  if (!person.name) {
    response.status(400).send({ error: 'name missing' })
  }

  if (!person.number) {
    response.status(400).send({ error: 'number missing' })
  }

  const newId = Math.floor(Math.random() * 10**6)
  const newPerson = {...person, id: newId}
  response.json(newPerson)
  persons = persons.concat(newPerson)
})

app.get('/info', (request, result) => {
  result.send(`Phonebook has info for ${persons.length} people <br/><br/> ${new Date()}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})