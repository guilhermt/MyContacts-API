const CategoryRepository = require('../repositories/CategoriesRepository');

class CategoryController {
  async index(request, response) {
    const { orderBy } = request.query;
    const categories = await CategoryRepository.findAll(orderBy);
    response.json(categories);
  }

  async show(request, response) {
    const { id } = request.params;

    const category = await CategoryRepository.findById(id);

    if (!category) response.status(404).json({ error: 'Category not Found' });

    response.json(category);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const CategoryExists = await CategoryRepository.findByName(name);

    if (CategoryExists) {
      return response.status(400).json({ error: 'This category name is already in use' });
    }

    const category = await CategoryRepository.create(name);
    response.json(category);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    const categoryFound = await CategoryRepository.findById(id);
    if (!categoryFound) {
      return response.status(400).json({ error: 'Category not found' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const nameUsed = await CategoryRepository.findByName(name);
    if (nameUsed && nameUsed.id !== id) {
      return response.status(400).json({ error: 'This category name is already in use' });
    }

    const updated = await CategoryRepository.update({ id, name });

    response.json(updated);
  }

  async delete(request, response) {
    const { id } = request.params;

    const categoryFound = await CategoryRepository.findById(id);
    if (!categoryFound) {
      return response.status(400).json({ error: 'Category not found' });
    }

    await CategoryRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new CategoryController();
