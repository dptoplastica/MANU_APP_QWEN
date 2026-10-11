import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // Mostrar mensaje según el modo de autenticación
        if (result.mode === 'local') {
          console.log('📦 ⚠️ Sesión iniciada en MODO LOCAL');
          console.log('📦 Los datos NO se persisten en Supabase');
          console.log('📦 Para persistencia completa, configura Supabase Auth correctamente');
        } else {
          console.log('🌐 ✅ Sesión iniciada con Supabase');
          console.log('🌐 Los datos se persisten en Supabase');
        }
        navigate('/dashboard');
      } else {
        setError(result.error || 'Credenciales incorrectas. Inténtelo de nuevo.');
      }
    } catch (err) {
      console.error('❌ Error en handleSubmit:', err);
      setError('Error al iniciar sesión. Inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">IES Lope de Vega</h1>
          <p className="text-gray-500 mt-1">Santa María de Cayón — Cantabria</p>
          <p className="text-sm text-gray-400 mt-2">Gestión Docente y Evaluación LOMLOE</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="profesor@ieslopedevega.es"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Conectando...' : 'Acceder'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-blue-800 mb-2">🔑 Credenciales de demostración:</p>
            <div className="space-y-2 text-xs text-blue-700">
              <div className="bg-white p-2 rounded border border-blue-200">
                <p className="font-semibold text-blue-900">👨‍🏫 Profesor:</p>
                <p><strong>Email:</strong> profesor@ieslopedevega.es</p>
                <p><strong>Contraseña:</strong> Prof2026!</p>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <p className="font-semibold text-blue-900">🔑 Administrador:</p>
                <p><strong>Email:</strong> admin@ieslopedevega.es</p>
                <p><strong>Contraseña:</strong> Admin2026!</p>
              </div>
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800">
                  <strong>⚠️ Modo Local:</strong> Si Supabase Auth no está configurado, la aplicación funciona en modo local con estas credenciales. Los datos NO se persisten en Supabase.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Curso académico 2026/2027 • LOMLOE
        </p>
      </div>
    </div>
  );
};
