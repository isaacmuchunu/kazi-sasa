import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const CandidateDetails = () => {
  const { username } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCandidate = {
      id: 1,
      username: username,
      name: "John Doe",
      title: "Senior Software Engineer",
      location: "Nairobi, Kenya",
      bio: "Passionate software engineer with 5+ years of experience in web development.",
      experience: [
        {
          company: "Tech Company",
          position: "Senior Developer",
          duration: "2020 - Present",
          description: "Leading development of web applications"
        }
      ],
      skills: ["JavaScript", "React", "Node.js", "Python"],
      education: [
        {
          institution: "University of Nairobi",
          degree: "BSc Computer Science",
          year: "2018"
        }
      ]
    };

    setTimeout(() => {
      setCandidate(mockCandidate);
      setLoading(false);
    }, 1000);
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Candidate not found</h1>
          <p className="text-gray-600 mt-2">The candidate you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{candidate.name}</h1>
              <p className="text-xl text-gray-600">{candidate.title}</p>
              <p className="text-gray-500">{candidate.location}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">About</h2>
          <p className="text-gray-600 leading-relaxed">{candidate.bio}</p>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Experience</h2>
          <div className="space-y-4">
            {candidate.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration}</p>
                <p className="text-gray-600 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Education</h2>
          <div className="space-y-2">
            {candidate.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Button */}
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Contact Candidate
          </button>
          <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
