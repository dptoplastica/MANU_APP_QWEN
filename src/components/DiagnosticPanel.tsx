import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';

export const DiagnosticPanel: React.FC = () => {
  const { supabaseConnected, currentUser } = useApp();
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'not-authenticated'>('checking');
  const [testResult, setTestResult] = useState<string>('');
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthStatus('authenticated');
        console.log('✅ Supabase Auth: Usuario autenticado', user.email);
      } else {
        setAuthStatus('not-authenticated');
        console.log('❌ Supabase Auth: No hay usuario autenticado');
      }
    } catch (error) {
      setAuthStatus('not-authenticated');
      console.error('❌ Error verificando autenticación:', error);
    }
  };

  const testSupabaseConnection = async () => {
    setTestResult('Probando conexión...');
    
    try {
      // Test 1: Verificar conexión básica
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .limit(1);
      
      if (schoolsError) {
        setTestResult(`❌ Error conectando a Supabase: ${schoolsError.message}`);
        console.error('Error schools:', schoolsError);
        return;
      }
      
      setTestResult('✅ Conexión básica OK. ');
      
      // Test 2: Verificar autenticación
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTestResult(prev => prev + '❌ No hay usuario autenticado en Supabase.');
        return;
      }
      
      setTestResult(prev => prev + `✅ Usuario: ${user.email}. `);
      
      // Test 3: Verificar perfil de usuario
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        setTestResult(prev => prev + `❌ Error obteniendo perfil: ${profileError.message}`);
        return;
      }
      
      setTestResult(prev => prev + `✅ Rol: ${profile.role}. `);
      
      // Test 4: Intentar crear un grupo de prueba
      const testGroup = {
        name: `Test Group ${Date.now()}`,
        course: 'Test Course',
        academicYearId: 'a0000000-0000-0000-0000-000000000010'
      };
      
      const { data: newGroup, error: createError } = await supabase
        .from('groups')
        .insert({
          name: testGroup.name,
          course: testGroup.course,
          academic_year_id: testGroup.academicYearId
        })
        .select()
        .single();
      
      if (createError) {
        setTestResult(prev => prev + `❌ Error creando grupo: ${createError.message}`);
        console.error('Error creating group:', createError);
        return;
      }
      
      setTestResult(prev => prev + `✅ Grupo creado: ${newGroup.id}. `);
      
      // Test 5: Eliminar el grupo de prueba
      const { error: deleteError } = await supabase
        .from('groups')
        .delete()
        .eq('id', newGroup.id);
      
      if (deleteError) {
        setTestResult(prev => prev + `⚠️ Grupo creado pero no se pudo eliminar: ${deleteError.message}`);
      } else {
        setTestResult(prev => prev + '✅ Grupo eliminado. TODO FUNCIONA CORRECTAMENTE.');
      }
      
    } catch (error) {
      setTestResult(`❌ Error inesperado: ${error}`);
      console.error('Error inesperado:', error);
    }
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 z-50"
      >
        🔧 Diagnóstico
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-4 max-w-2xl z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">Panel de Diagnóstico</h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Conexión Supabase:</span>
          <span className={supabaseConnected ? 'text-green-600' : 'text-red-600'}>
            {supabaseConnected ? '✅ Conectado' : '❌ No conectado'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Autenticación:</span>
          <span className={authStatus === 'authenticated' ? 'text-green-600' : 'text-red-600'}>
            {authStatus === 'authenticated' ? '✅ Autenticado' : 
             authStatus === 'checking' ? '🔄 Verificando...' : '❌ No autenticado'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Usuario actual:</span>
          <span className="text-gray-700">
            {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Ninguno'}
          </span>
        </div>
        
        <div className="mt-3">
          <button
            onClick={testSupabaseConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Probar operaciones CRUD
          </button>
        </div>
        
        {testResult && (
          <div className="mt-3 p-3 bg-gray-50 rounded border text-xs font-mono whitespace-pre-wrap">
            {testResult}
          </div>
        )}
        
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>💡 Si las operaciones CRUD fallan:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Verifica que hayas ejecutado el script de políticas RLS (Paso 7)</li>
            <li>Abre la consola del navegador (F12) para ver errores detallados</li>
            <li>Verifica que las variables de entorno estén configuradas</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
