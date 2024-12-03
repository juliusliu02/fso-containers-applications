const express = require('express');
const { Todo } = require('../mongo')
const req = require("express/lib/request");
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findById(id);
  res.send(todo);
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const todoCount = parseInt(await redis.getAsync("count") || 0)
  redis.setAsync("count", todoCount + 1)
  res.send(todo);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { text, done } = req.body;
  const updatedTodo = {text, done}

  try {
    const newTodo = await Todo.findByIdAndUpdate(id, updatedTodo, {new: true})
    res.status(201).send(newTodo);
  } catch (err) {
    res.status(400);
  }
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
