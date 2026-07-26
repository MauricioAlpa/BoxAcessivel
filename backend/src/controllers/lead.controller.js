import {
  criarOuReativarLead,
  listarLeads,
  atualizarStatusLead,
} from '../models/lead.model.js';

export class LeadController {
  static async criar(req, res, next) {
    try {
      const { nome, email, telefone } = req.body;
      const lead = await criarOuReativarLead({ nome, email, telefone });
      res.status(201).json(lead);
    } catch (err) {
      next(err);
    }
  }

  static async listar(req, res, next) {
    try {
      const leads = await listarLeads();
      res.json(leads);
    } catch (err) {
      next(err);
    }
  }

  static async atualizarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const lead = await atualizarStatusLead(id, status);
      res.json(lead);
    } catch (err) {
      next(err);
    }
  }
}