import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, BookOpen, Users, Download, BookOpenCheck, ArrowUpRight } from 'lucide-react';
import { Software } from '../../types/software';
import { Tutorial } from '../../types/tutorials';
import { supabase } from '../../lib/supabase';

interface Stats {
  visits: {
    today: number;
    week: number;
    month: number;
  };
  downloads: number;
  tutorialViews: number;
}

export function AdminDashboardPage() {
  const [software, setSoftware] = useState<Software[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'software' | 'tutorials'>('overview');
  const [stats, setStats] = useState<Stats>({
    visits: { today: 0, week: 0, month: 0 },
    downloads: 0,
    tutorialViews: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now);
    startOfMonth.setDate(now.getDate() - 30);

    const [todayViews, weekViews, monthViews, downloads, tutorialViews] = await Promise.all([
      supabase
        .from('page_views')
        .select('count', { count: 'exact', head: true })
        .gte('created_at', startOfToday.toISOString()),
      supabase
        .from('page_views')
        .select('count', { count: 'exact', head: true })
        .gte('created_at', startOfWeek.toISOString()),
      supabase
        .from('page_views')
        .select('count', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString()),
      supabase
        .from('software_downloads')
        .select('count', { count: 'exact', head: true }),
      supabase
        .from('tutorial_views')
        .select('count', { count: 'exact', head: true })
    ]);

    setStats({
      visits: {
        today: todayViews.count || 0,
        week: weekViews.count || 0,
        month: monthViews.count || 0
      },
      downloads: downloads.count || 0,
      tutorialViews: tutorialViews.count || 0
    });
  }

  async function fetchData() {
    setIsLoading(true);
    
    await Promise.all([
      fetchStats(),
      (async () => {
        const [softwareResponse, tutorialsResponse] = await Promise.all([
          supabase.from('software').select('*').order('name'),
          supabase.from('tutorials').select('*, tutorial_categories(name)').order('title')
        ]);
        
        if (!softwareResponse.error) {
          setSoftware(softwareResponse.data || []);
        }
        
        if (!tutorialsResponse.error) {
          setTutorials(tutorialsResponse.data || []);
        }
      })()
    ]);
    
    setIsLoading(false);
  }

  const deleteSoftware = async (id: string) => {
    if (!confirm('Are you sure you want to delete this software?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('software')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setSoftware((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting software:', error);
      alert('Failed to delete software.');
    }
  };

  const deleteTutorial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTutorials((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      alert('Failed to delete tutorial.');
    }
  };

  const filteredSoftware = software.filter((item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutorials = tutorials.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tutorial_categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: number; icon: any; trend?: string }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="bg-blue-50 rounded-lg p-3">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        {trend && (
          <span className="text-green-500 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          {activeTab !== 'overview' && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
          
          {activeTab === 'software' && (
            <Link 
              to="/admin/software/new" 
              className="btn-primary flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Software
            </Link>
          )}
          
          {activeTab === 'tutorials' && (
            <Link 
              to="/admin/tutorials/new" 
              className="btn-primary flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Tutorial
            </Link>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'software'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Software
            </button>
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tutorials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tutorials
            </button>
          </nav>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Today's Visits"
            value={stats.visits.today}
            icon={Users}
          />
          <StatCard
            title="Weekly Visits"
            value={stats.visits.week}
            icon={Users}
            trend="+12.5%"
          />
          <StatCard
            title="Monthly Visits"
            value={stats.visits.month}
            icon={Users}
            trend="+8.2%"
          />
          <StatCard
            title="Total Downloads"
            value={stats.downloads}
            icon={Download}
          />
          <StatCard
            title="Tutorial Views"
            value={stats.tutorialViews}
            icon={BookOpenCheck}
          />
        </div>
      ) : activeTab === 'software' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publisher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSoftware.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {item.logo ? (
                            <img className="h-10 w-10 object-contain" src={item.logo} alt="" />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.publisher}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/software/${item.id}/edit`} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteSoftware(item.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTutorials.map((tutorial) => (
                  <tr key={tutorial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen size={20} className="text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">
                          {tutorial.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {tutorial.tutorial_categories?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tutorial.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/tutorials/${tutorial.id}/edit`} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteTutorial(tutorial.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}