import { criarOuReativarLead } from '../models/lead.model.js';

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
}