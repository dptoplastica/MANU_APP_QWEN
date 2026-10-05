import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { school } from '../data/seed';
import {
  Home, BookOpen, Users, GraduationCap, ClipboardList, Target,
  Activity, BookMarked, BarChart3, FileText, Settings, Shield,
  Menu, X, Bell, LogOut, ChevronDown, User, Download
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Inicio', icon: Home },
  { path: '/materias', label: 'Mis materias', icon: BookOpen },
  { path: '/grupos', label: 'Mis grupos', icon: Users },
  { path: '/programaciones', label: 'Programaciones', icon: ClipboardList },
  { path: '/situaciones-aprendizaje', label: 'Situaciones de aprendizaje', icon: Target },
  { path: '/actividades', label: 'Actividades', icon: Activity },
  { path: '/cuaderno', label: 'Cuaderno del profesor', icon: BookMarked },
  { path: '/evaluaciones', label: 'Evaluaciones', icon: BarChart3 },
  { path: '/competencias', label: 'Competencias', icon: GraduationCap },
  { path: '/informes', label: 'Informes', icon: FileText },
  { path: '/alumnos', label: 'Alumnos', icon: Users },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
  { path: '/setup', label: 'Guía de configuración', icon: Shield },
  { path: '/sql-downloads', label: 'Descargar SQL', icon: Download },
];

const adminItems = [
  { path: '/admin', label: 'Administración', icon: Shield },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, notifications, supabaseConnected } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read && n.userId === currentUser?.id);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800 text-sm">{school.name}</h1>
                <p className="text-xs text-gray-500">{school.location}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {currentUser?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase">Administración</p>
                </div>
                {adminItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <p className="text-xs text-gray-400">
                {supabaseConnected ? 'Supabase conectado' : 'Modo demo local'}
              </p>
            </div>
            <p className="text-xs text-gray-400 text-center">Curso 2026/2027</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{school.name}</h2>
                <p className="text-xs text-gray-500 hidden sm:block">Curso 2026/2027 • {school.region}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{currentUser?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500">{currentUser?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {currentUser?.role === 'admin' ? 'Administrador' : 'Profesor'}
                      </span>
                    </div>
                    <button
                      onClick={() => { navigate('/configuracion'); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" /> Configuración
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
