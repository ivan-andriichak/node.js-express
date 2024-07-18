const express = require('express');
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const users = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    password: 'alicepassword123'
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    password: 'bobpassword123'
  },
  {
    id: 3,
    name: 'Charlie',
    email: 'charlie@example.com',
    password: 'charliepassword123'
  },
  {
    id: 4,
    name: 'Diana',
    email: 'diana@example.com',
    password: 'dianapassword123'
  },
  {
    id: 5,
    name: 'Eve',
    email: 'eve@example.com',
    password: 'evepassword123'
  }
];

app.get('/users', (req, res) => {
  try {
    res.json(users)
  } catch (e) {
    res.status(400).json(e.message);
  }
})

app.post('/users', (req, res) => {
  try {
    const {name, email, password} = req.body;

    const index = users.findIndex((user) => user.email === email)
    if (index !== -1) {
      return res.status(409).json('User with this email already exists')
    }
    const newUser = {
      id: users[users.length - 1].id + 1,
      name,
      email,
      password
    }
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json(e.message)
  }
})

app.get('/users/:userId', (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = users.find(user => user.id === userId);
    if (!user) {
      return res.status(404).json('User not found');
    }
    res.json(user);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.put('/users/:userId', (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const {name, email, password} = req.body;
    const user = users.find(user => user.id === userId);
    if (!user) {
      return res.status(404).json('User not found')
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    res.status(201).json(user);
  } catch (e) {
    res.status(400).json(e.message)
  }
});

app.delete('/users/:userId', (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const index = users.findIndex(user => user.id === userId);
    if (index === -1) {
      return res.status(404).json('User not found')
    }
    users.splice(index, 1);
    res.sendStatus(204);
  } catch (e) {
    res.status(400).json(e.message)
  }
})

app.listen(3001, () => {
  console.log("Server started on port 3001")
});