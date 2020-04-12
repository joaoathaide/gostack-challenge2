const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository id.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = { ...repositories[repositorieIndex], title, url, techs };

  repositories[repositorieIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repositoriesIndex].likes++;
  return response.json(repositories[repositoriesIndex]);
});

module.exports = app;
