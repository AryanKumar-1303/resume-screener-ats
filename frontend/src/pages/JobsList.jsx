import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Upload, ChevronRight } from 'lucide-react';
import api from '../services/api';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-500">Create jobs and manage candidate resumes</p>
        </div>
        
        <Link to="/jobs/create" className="flex items-center gap-2 bg-brand-600 text-black px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
          <Plus size={20} /> Create New Job
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No jobs found. Click "Create New Job" to get started.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">Job Title</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Department</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Experience</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-400" /> {job.title}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{job.department}</td>
                  <td className="p-4 text-gray-600">{job.experience_required_years} Yrs</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize">
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => navigate(`/jobs/${job.id}/upload`)}
                      className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-medium text-sm bg-brand-50 px-3 py-1.5 rounded-lg"
                    >
                      <Upload size={16} /> Screen Resumes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default JobsList;