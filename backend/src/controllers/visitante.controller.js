import { hashIp } from '../utils/hash.js';
import { registrarVisita } from '../models/visitante.model.js';

export class VisitanteController {
  static async registrar(req, res, next) {
    try {
      const ipHash = hashIp(req.ip);
      const { origem } = req.body;

      await registrarVisita({ ipHash, origem });
      res.status(201).json({ mensagem: 'Visita registrada' });
    } catch (err) {
      next(err);
    }
  }
}