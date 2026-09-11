import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const JobCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    experience_required_years: 0,
    description: '',
  });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setSkills([...skills, { skill_name: currentSkill.trim(), is_required: true }]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', { ...formData, skills });
      navigate('/jobs');
    } catch (err) {
      alert('Failed to create job');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Jobs
      </button>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Job Posting</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Experience (Years)</label>
              <input type="number" step="0.5" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                value={formData.experience_required_years} onChange={e => setFormData({...formData, experience_required_years: parseFloat(e.target.value)})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea required rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Technical Skills</label>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="e.g., Python, React" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={currentSkill} onChange={e => setCurrentSkill(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
              <button type="button" onClick={handleAddSkill} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, idx) => (
                <span key={idx} className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-brand-100">
                  {s.skill_name}
                  <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveSkill(idx)} />
                </span>
              ))}
            </div>
          </div>

            <button type="submit" className="w-full bg-brand-600 text-black py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors">
            Publish Job Posting
            </button>
        </form>
      </div>
    </div>
  );
};

export default JobCreate;