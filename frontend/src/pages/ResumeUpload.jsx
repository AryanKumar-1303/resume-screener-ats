import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, File, Loader2 } from 'lucide-react';
import api from '../services/api';

const ResumeUpload = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndScreen = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Step 1: Upload and Parse Resume
      setStatusText('Parsing Resume (Extracting Text & Entities)...');
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await api.post(`/resumes/upload/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const candidateId = uploadRes.data.candidate_id;

      // Step 2: Trigger AI Screening (Embeddings & ATS Score)
      setStatusText('Running AI Semantic Matching & ATS Scoring...');
      const screenRes = await api.post(`/screening/evaluate/${candidateId}`);
      
      // Navigate to Results page and pass the data directly
      navigate(`/candidates/results`, { state: { result: screenRes.data } });
    } catch (err) {
      console.error(err);
      alert('Error during processing. Check console for details.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
        <UploadCloud className="mx-auto h-16 w-16 text-brand-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Candidate Resume</h2>
        <p className="text-gray-500 mb-8">Supports PDF and DOCX formats up to 10MB</p>

        {!loading ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 hover:border-brand-500 transition-colors">
              <input type="file" id="file-upload" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                {file ? (
                  <div className="flex items-center gap-2 text-brand-700 font-medium">
                    <File size={24} /> {file.name}
                  </div>
                ) : (
                  <span className="text-gray-600 font-medium bg-gray-100 px-6 py-2 rounded-lg hover:bg-gray-200">
                    Browse Files
                  </span>
                )}
              </label>
            </div>
            
            
            <button
            onClick={handleUploadAndScreen}
            disabled={!file}
            className="w-full bg-brand-600 text-black py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
            Analyze Resume
            </button>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-brand-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-900">{statusText}</p>
            <p className="text-sm text-gray-500 mt-2">Our NLP models are processing the document...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;