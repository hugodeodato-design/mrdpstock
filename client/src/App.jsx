// src/App.jsx — Composant racine
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './hooks/useAuth.js';
import { api, downloadBlob } from './utils/api.js';
import { T } from './utils/theme.js';
import { Ic, Btn, Avatar, Badge, Modal, Spinner, RoleBadge, toast, registerToast } from './components/ui/index.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import ChangePasswordScreen from './components/ChangePasswordScreen.jsx';
import DashboardView from './components/views/DashboardView.jsx';
import StockView from './components/views/StockView.jsx';
import AlertsView from './components/views/AlertsView.jsx';
import HistoryView from './components/views/HistoryView.jsx';
import UsersView from './components/views/UsersView.jsx';
import SettingsView from './components/views/SettingsView.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';

const NAV = [
  { id: 'dashboard', icon: 'home',    label: 'Tableau de bord' },
  { id: 'stock',     icon: 'package', label: 'Stock'           },
  { id: 'alerts',    icon: 'bell',    label: 'Alertes'         },
  { id: 'history',   icon: 'history', label: 'Historique'      },
  { id: 'users',     icon: 'users',   label: 'Utilisateurs',   adminOnly: true },
  { id: 'settings',  icon: 'settings',label: 'Paramètres',     adminOnly: true },
];

export default function App() {
  const { user, loading, mustChangePassword, login, logout, changePassword } = useAuth();
  const [view, setView] = useState('dashboard');
  const [bases, setBases] = useState([]);
  const [activeBase, setActiveBase] = useState(null);
  const [settings, setSettings] = useState({});
  const [alertCount, setAlertCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Enregistrer la fonction toast
  registerToast((msg, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  });

  // Charger données initiales
  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.getBases(),
      api.getSettings(),
      api.getAlerts(),
    ]).then(([b, s, a]) => {
      setBases(b);
      setSettings(s);
      setAlertCount(a.length);
      if (b.length > 0 && !activeBase) setActiveBase(b[0].id);
    }).catch(err => console.error('Init error:', err));
  }, [user]);

  const refreshBases = useCallback(async () => {
    const b = await api.getBases();
    setBases(b);
    return b;
  }, []);

  const refreshAlerts = useCallback(async () => {
    const a = await api.getAlerts();
    setAlertCount(a.length);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#060D18', flexDirection: 'column', gap: 16 }}>
        <Spinner size={40} />
        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>MRDPSTOCK</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={login} companyName={settings.companyName} />;
  if (mustChangePassword) return <ChangePasswordScreen user={user} onSave={changePassword} onLogout={logout} />;

  const isAdmin = user.role === 'admin';
  const isViewer = user.role === 'viewer';

  const visibleNav = NAV.filter(n => !n.adminOnly || isAdmin);

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg, fontFamily: "'DM Sans',system-ui,sans-serif", overflow: 'hidden' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 3px; }
        body { font-family: 'DM Sans',system-ui,sans-serif; background: #060D18; color: #E8F0FE; }
      `}</style>

      {/* ─── Sidebar ──────────────────────────────────────────────────── */}
      <aside style={{ width: 220, background: T.surface, borderRight: `1px solid ${T.bdr}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${T.bdr}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.greenBg, border: `1px solid ${T.greenBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="package" s={18} c={T.brand} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: T.txt }}>MRDPSTOCK</div>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2, textTransform: 'uppercase' }}>{settings.companyName || 'M.R.D.P.S 27'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '10px 10px', flex: 1 }}>
          {visibleNav.map(n => {
            const active = view === n.id;
            return (
              <button key={n.id} onClick={() => setView(n.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', marginBottom: 2, fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500, background: active ? T.greenBg : 'transparent', color: active ? T.brand : T.muted, transition: 'all .12s', position: 'relative' }}>
                <Ic n={n.icon} s={16} c={active ? T.brand : T.muted} />
                {n.label}
                {n.id === 'alerts' && alertCount > 0 && (
                  <span style={{ marginLeft: 'auto', background: T.red, color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{alertCount}</span>
                )}
                {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: T.brand, borderRadius: '0 2px 2px 0' }} />}
              </button>
            );
          })}
        </nav>

        {/* Bases clients */}
        <div style={{ borderTop: `1px solid ${T.bdr}`, padding: '12px 10px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.muted, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 12px', marginBottom: 6 }}>Bases</div>
          {bases.map(b => (
            <button key={b.id}
              onClick={() => { setActiveBase(b.id); setView('stock'); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, background: activeBase === b.id && view === 'stock' ? T.surface2 : 'transparent', color: activeBase === b.id && view === 'stock' ? T.txt : T.muted, marginBottom: 1, transition: 'all .1s' }}>
              <Ic n="building" s={13} c={activeBase === b.id ? T.brand : T.muted} />
              <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
              {b.alerts > 0 && <span style={{ background: T.orangeBg, color: T.orange, borderRadius: 8, fontSize: 9, fontWeight: 700, padding: '1px 5px' }}>{b.alerts}</span>}
            </button>
          ))}
          {!isViewer && (
            <button onClick={() => setView('dashboard')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, border: `1px dashed ${T.bdr}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, color: T.muted, background: 'transparent', marginTop: 4, transition: 'all .1s' }}>
              <Ic n="plus" s={12} /> Nouvelle base
            </button>
          )}
        </div>

        {/* User footer */}
        <div style={{ borderTop: `1px solid ${T.bdr}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={user.name} color={user.color} size={34} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <RoleBadge role={user.role} />
            </div>
            <button onClick={logout} title="Déconnexion"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: T.muted, padding: 6, borderRadius: 7, display: 'flex' }}>
              <Ic n="logout" s={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {view === 'dashboard' && (
          <DashboardView
            bases={bases} user={user} settings={settings}
            onSelectBase={(id) => { setActiveBase(id); setView('stock'); }}
            onNewBase={async (name) => { await api.createBase(name); const b = await refreshBases(); if (b.length > 0) setActiveBase(b[b.length - 1].id); setView('stock'); }}
            alertCount={alertCount}
          />
        )}
        {view === 'stock' && activeBase && (
          <StockView
            baseId={activeBase} user={user}
            bases={bases} onRefreshBases={refreshBases}
            onRefreshAlerts={refreshAlerts}
            onSelectBase={setActiveBase}
          />
        )}
        {view === 'stock' && !activeBase && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: T.muted, flexDirection: 'column', gap: 12 }}>
            <Ic n="building" s={40} c={T.muted} />
            <div>Sélectionnez ou créez une base</div>
          </div>
        )}
        {view === 'alerts'   && <AlertsView onSelectBase={(id) => { setActiveBase(id); setView('stock'); }} />}
        {view === 'history'  && <HistoryView user={user} bases={bases} />}
        {view === 'users'    && isAdmin && <UsersView user={user} />}
        {view === 'settings' && isAdmin && (
          <SettingsView settings={settings} onSave={async (s) => { await api.saveSettings(s); setSettings(s); toast('Paramètres enregistrés'); }} />
        )}
      </main>

      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </div>
  );
}
