import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, BrainCircuit, Target, BookOpen } from 'lucide-react';

const CandidateScreening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result; // Now contains REAL data from the API call above

  if (!result) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl text-gray-600">No screening data found.</h2>
        <button onClick={() => navigate('/jobs')} className="mt-4 text-blue-600 underline">Back to Jobs</button>
      </div>
    );
  }

  const ScoreCircle = ({ score, label, color }) => (
    <div className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className={`text-4xl font-extrabold ${color} mb-2`}>{Math.round(score)}%</div>
      <div className="text-sm font-medium text-gray-500 text-center">{label}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-10 p-6">
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Jobs
      </button>

      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-8 mb-8 text-white flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Screening Report</h1>
          <p className="text-slate-300 opacity-90">Detailed analysis of candidate profile against job requirements.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold mb-1">Recommendation</div>
          <div className={`text-2xl font-bold px-4 py-2 rounded-lg inline-block bg-white/10 ${
            result.recommendation.includes('Reject') ? 'text-red-400' : 'text-green-400'
          }`}>
            {result.recommendation}
          </div>
        </div>
      </div>

      {/* Primary Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ScoreCircle score={result.ats_score} label="Overall ATS Score" color="text-blue-600" />
        {/* If backend returns raw scores out of 25, keep the multiplier. If it returns 0-100, remove it */}
        <ScoreCircle score={result.semantic_score * 4} label="Contextual Semantic Match" color="text-purple-600" />
        <ScoreCircle score={result.skill_match_score * 2.5} label="Required Skills Match" color="text-green-600" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* NLP Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BrainCircuit className="text-purple-500" /> AI Insights
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Target className="text-gray-400 shrink-0 mt-1" size={20}/>
              <div>
                <p className="font-medium text-gray-900">Semantic Engine Analysis</p>
                <p className="text-sm text-gray-500">The AI determined the contextual meaning of the resume overlaps with the job description by {Math.round(result.semantic_score * 4)}%.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="text-gray-400 shrink-0 mt-1" size={20}/>
              <div>
                <p className="font-medium text-gray-900">Experience & Education Mapping</p>
                <p className="text-sm text-gray-500">Experience Score: {result.experience_score}/15 | Education Score: {result.education_score}/10</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Skill Gap Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Gap Analysis</h3>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
              <CheckCircle2 size={18} /> Matched Skills ({result.matched_skills?.length || 0})
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matched_skills?.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium border border-green-200 rounded-md capitalize">
                  {skill}
                </span>
              ))}
              {(!result.matched_skills || result.matched_skills.length === 0) && <span className="text-gray-500 text-sm">No exact matches found.</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-red-700 font-semibold mb-3">
              <XCircle size={18} /> Missing Skills ({result.missing_skills?.length || 0})
            </div>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills?.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium border border-red-200 rounded-md capitalize">
                  {skill}
                </span>
              ))}
              {(!result.missing_skills || result.missing_skills.length === 0) && <span className="text-gray-500 text-sm">All required skills met!</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateScreening;