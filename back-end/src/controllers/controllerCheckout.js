const jwt = require('jsonwebtoken');
const jwtKey = require('fs').readFileSync('jwt.evaluation.key', {
  encoding: 'utf-8',
});
const serviceCheckout = require('../services/serviceCheckout');

const getIdAndRole = (authorization) => {
  const { id, role } = jwt.verify(authorization, jwtKey);
  return { id, role };
};

const ERROR_MESSAGE = 'Ocorreu um erro';
const requestId = async (req, res) => {
  const token = req.headers.authorization;
  const data = await serviceCheckout.createSale(req.body, token);
  return res.status(201).json({ message: 'created', response: data });
};

const getAll = async (req, res) => {
  const { authorization } = req.headers;
  const { id, role } = getIdAndRole(authorization);
  const sales = await serviceCheckout.getAllService(id, role);
  return res.status(200).json(sales);
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedStatus = await serviceCheckout.updateStatusService(id, status);

  res.status(200).json(updatedStatus);
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const sales = await serviceCheckout.getOneService(id);
    return res.status(200).json(sales);
  } catch (e) {
    res.status(500).json({ message: ERROR_MESSAGE });
  }
};

module.exports = { requestId, getAll, getOne, updateStatus };
