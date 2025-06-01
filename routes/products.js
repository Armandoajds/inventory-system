const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products/index', { products });
  } catch (error) {
    res.status(500).render('error', { error: 'Error al cargar productos' });
  }
});

// Formulario para nuevo producto
router.get('/new', (req, res) => {
  res.render('products/new');
});

// Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
  } catch (error) {
    res.render('products/new', { error: 'Error al crear producto' });
  }
});

// Ver producto específico
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('error', { error: 'Producto no encontrado' });
    }
    res.render('products/show', { product });
  } catch (error) {
    res.status(500).render('error', { error: 'Error al cargar el producto' });
  }
});

// Formulario para editar producto
router.get('/:id/edit', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
  } catch (error) {
    res.status(500).render('error', { error: 'Error al cargar el producto' });
  }
});

// Actualizar producto
router.post('/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/products');
  } catch (error) {
    res.status(500).render('error', { error: 'Error al actualizar el producto' });
  }
});

// Eliminar producto
router.post('/:id/delete', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    res.status(500).render('error', { error: 'Error al eliminar el producto' });
  }
});

// Búsqueda avanzada por texto
router.get('/search/text', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const products = await Product.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    res.render('products/index', { products, searchTerm });
  } catch (error) {
    res.status(500).render('error', { error: 'Error en la búsqueda' });
  }
});

// Búsqueda avanzada por categoría y marca
router.get('/search/filter', async (req, res) => {
  try {
    const { category, brand } = req.query;
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    const products = await Product.find(query);
    res.render('products/index', { products, filters: { category, brand } });
  } catch (error) {
    res.status(500).render('error', { error: 'Error en la búsqueda' });
  }
});

module.exports = router; 