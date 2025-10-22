import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    gender: '',
    dob: '',
    user_type: 'candidate',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Client-side validation
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-indigo-600 mb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
              KS
            </span>
            Kazi Sasa
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4">Create your account</h1>
          <p className="text-slate-600 mt-2">Join thousands of job seekers and employers</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <Select
              label="I am a"
              name="user_type"
              id="user_type"
              required
              value={formData.user_type}
              onChange={handleChange}
              options={[
                { value: 'candidate', label: 'Job Seeker (Candidate)' },
                { value: 'employer', label: 'Employer (Company)' },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                type="text"
                name="first_name"
                id="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
              />

              <Input
                label="Last Name"
                type="text"
                name="last_name"
                id="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
            </div>

            <Input
              label="Username"
              type="text"
              name="user_name"
              id="user_name"
              required
              value={formData.user_name}
              onChange={handleChange}
              error={errors.user_name}
              helperText="This will be your unique identifier"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email address"
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone_number"
                id="phone_number"
                required
                value={formData.phone_number}
                onChange={handleChange}
                error={errors.phone_number}
                placeholder="+254712345678"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Gender"
                name="gender"
                id="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />

              <Input
                label="Date of Birth"
                type="date"
                name="dob"
                id="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Password"
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText="Minimum 8 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
