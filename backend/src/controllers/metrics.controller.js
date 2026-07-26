import { contarVisitas } from '../models/visitante.model.js';
import { contarLeads } from '../models/lead.model.js';

export class MetricsController {
  static async conversao(req, res, next) {
    try {
      const totalVisitas = await contarVisitas();
      const totalLeads = await contarLeads();

      const taxaConversao = totalVisitas > 0
        ? Number(((totalLeads / totalVisitas) * 100).toFixed(2))
        : 0;

      res.json({ totalVisitas, totalLeads, taxaConversao });
    } catch (err) {
      next(err);
    }
  }
}