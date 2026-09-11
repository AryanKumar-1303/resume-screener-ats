import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileCheck, Target } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, candidates: 0 });
  const [jobs, setJobs] = useState([]);
  
  // Mock chart data for demonstration until backend stats endpoint is built
  const chartData = [
    { name: '0-50%', count: 4 },
    { name: '51-70%', count: 12 },
    { name: '71-85%', count: 8 },
    { name: '86-100%', count: 5 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
        setStats({ jobs: response.data.length, candidates: 29 }); // Mock candidate count
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Jobs" value={stats.jobs} icon={<Briefcase size={24}/>} color="bg-blue-100 text-blue-600" />
        <StatCard title="Total Candidates" value={stats.candidates} icon={<Users size={24}/>} color="bg-indigo-100 text-indigo-600" />
        <StatCard title="Resumes Screened" value="29" icon={<FileCheck size={24}/>} color="bg-green-100 text-green-600" />
        <StatCard title="Avg. ATS Score" value="74%" icon={<Target size={24}/>} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">ATS Score Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Jobs Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Jobs</h2>
          <div className="space-y-4">
            {jobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex justify-between items-center p-4 border border-gray-50 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.department} • {job.location}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize">
                  {job.status}
                </span>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-500 text-center py-4">No jobs created yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;