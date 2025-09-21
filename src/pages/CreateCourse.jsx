import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Course created successfully!');
    navigate('/instructor/courses');
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/instructor/courses')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600 mt-1">Start building your course</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Course Information</h2>
              <p className="text-sm text-gray-600">Basic information about your course</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Course Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter course title"
                  error={!!errors.title}
                  {...register('title', { required: 'Course title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Course Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe what students will learn in this course"
                  {...register('description')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('category')}
                  >
                    <option value="">Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Photography">Photography</option>
                    <option value="Music">Music</option>
                    <option value="Language">Language</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    id="level"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('level')}
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('price', { valueAsNumber: true })}
                />
                <p className="mt-1 text-sm text-gray-500">Set to 0 for a free course</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload a course thumbnail</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  <Button variant="outline" className="mt-2" type="button">
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/instructor/courses')}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Create Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};
