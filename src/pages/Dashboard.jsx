import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  Plus,
  Eye,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getMyEnrollments, getMyCourses } from '../utils/mockData';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { formatDate, getProgressColor, getProgressBgColor, getCourseLevelColor } from '../utils/helpers';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { user, isEducator, isStudent } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    averageProgress: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    
    if (isEducator) {
      // Fetch educator dashboard data
      const coursesResponse = getMyCourses(user.id, { limit: 5 });
      setRecentCourses(coursesResponse.courses);
      
      // Calculate stats
      const totalCourses = coursesResponse.pagination.total;
      const totalStudents = coursesResponse.courses.reduce((sum, course) => sum + course.enrollmentCount, 0);
      
      setStats({
        totalCourses,
        totalStudents,
        totalEnrollments: totalStudents,
        averageProgress: 75 // Mock data
      });
    } else if (isStudent) {
      // Fetch student dashboard data
      const enrollmentsResponse = getMyEnrollments(user.id, { limit: 5 });
      setMyEnrollments(enrollmentsResponse.enrollments);
      
      // Calculate stats
      const totalEnrollments = enrollmentsResponse.pagination.total;
      const averageProgress = enrollmentsResponse.enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / enrollmentsResponse.enrollments.length || 0;
      
      setStats({
        totalCourses: totalEnrollments,
        totalStudents: 0,
        totalEnrollments,
        averageProgress
      });
    }
    setLoading(false);
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your {isEducator ? 'courses' : 'learning'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isEducator ? (
          <>
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              icon={BookOpen}
              color="primary"
            />
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Total Enrollments"
              value={stats.totalEnrollments}
              icon={TrendingUp}
              color="blue"
            />
            <StatCard
              title="Avg. Progress"
              value={`${Math.round(stats.averageProgress)}%`}
              icon={Award}
              color="purple"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Enrolled Courses"
              value={stats.totalCourses}
              icon={BookOpen}
              color="primary"
            />
            <StatCard
              title="Completed"
              value={Math.round(stats.totalCourses * stats.averageProgress / 100)}
              icon={Award}
              color="green"
            />
            <StatCard
              title="In Progress"
              value={stats.totalCourses - Math.round(stats.totalCourses * stats.averageProgress / 100)}
              icon={Clock}
              color="blue"
            />
            <StatCard
              title="Avg. Progress"
              value={`${Math.round(stats.averageProgress)}%`}
              icon={TrendingUp}
              color="purple"
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses / My Enrollments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEducator ? 'Recent Courses' : 'My Courses'}
              </h2>
              {isEducator && (
                <Link to="/instructor/courses/create">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Course
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEducator ? (
              recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.enrollmentCount} students</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link to={`/courses/${course.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/instructor/courses/${course.id}/edit`}>
                          <Button size="sm">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link to="/instructor/courses">
                      <Button variant="outline">View All Courses</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Create your first course to get started</p>
                  <Link to="/instructor/courses/create">
                    <Button>Create Course</Button>
                  </Link>
                </div>
              )
            ) : (
              myEnrollments.length > 0 ? (
                <div className="space-y-4">
                  {myEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{enrollment.title}</h3>
                          <p className="text-sm text-gray-600">by {enrollment.firstName} {enrollment.lastName}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCourseLevelColor(enrollment.level)}`}>
                          {enrollment.level}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(enrollment.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressBgColor(enrollment.progress)}`}
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Enrolled {formatDate(enrollment.enrolledAt)}
                        </span>
                        <Link to={`/course/${enrollment.courseId}/learn`}>
                          <Button size="sm">Continue</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link to="/courses">
                      <Button variant="outline">Browse More Courses</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
                  <p className="text-gray-600 mb-4">Start learning by enrolling in a course</p>
                  <Link to="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEducator ? 'Quick Actions' : 'Recent Activity'}
            </h2>
          </CardHeader>
          <CardContent>
            {isEducator ? (
              <div className="space-y-4">
                <Link to="/instructor/courses/create" className="block">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Plus className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Create New Course</h3>
                        <p className="text-sm text-gray-600">Start building your next course</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="/instructor/courses" className="block">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Manage Courses</h3>
                        <p className="text-sm text-gray-600">Edit and organize your courses</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="/courses" className="block">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Browse Courses</h3>
                        <p className="text-sm text-gray-600">Explore other instructors' courses</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Continue Learning</h3>
                      <p className="text-sm text-gray-600">Resume your courses</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Achievements</h3>
                      <p className="text-sm text-gray-600">Track your learning progress</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Explore Courses</h3>
                      <p className="text-sm text-gray-600">Discover new topics to learn</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
