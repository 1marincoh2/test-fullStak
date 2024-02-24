const Coach = require('../models/coach');


module.exports = {

    async createCoach(req, res) {
      try {
        const coach = await Coach.create(req.body);
        res.json(coach);
      } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
      }
    },
  
    async getCoachs(req, res) {
      try {
        const coachs = await Coach.find();
        res.json(coachs);
      } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
      }
    },
  
    async getCoachById(req, res) {
      const coachId = req.params.id;
      try {
        const coach = await Coach.findById(coachId);
        res.json(coach);
      } catch (err) {
        res.status(500).json({ error: 'Error fetching user' });
      }
    },
  
    async updateCoach(req, res) {
      const coachId = req.params.id;
      try {
        const updatedCoach = await Coach.findByIdAndUpdate(coachId, req.body, { new: true });
        res.json(updatedCoach);
      } catch (err) {
        res.status(500).json({ error: 'Error updating user' });
      }
    },
  
    async deleteCoach(req, res) {
      const coachId = req.params.id;
      try {
        await Coach.findByIdAndDelete(coachId);
        res.json({ message: 'User deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Error deleting user' });
      }
    },
  };