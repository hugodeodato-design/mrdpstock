// src/components/LoginScreen.jsx
import { useState, useEffect } from 'react';
import { Ic } from './ui/index.jsx';
import { T } from '../utils/theme.js';
import { api } from '../utils/api.js';

export default function LoginScreen({ onLogin, companyName }) {
  const [users, setUsers] = useState([]);
  const [selUser, setSelUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    api.getUsers()
      .then(list => {
        const active = list.filter(u => u.is_active !== 0);
        setUsers(active);
        if (active.length > 0) setSelUser(active[0].id);
      })
      .catch(() => setErr('Impossible de charger les utilisateurs. Vérifiez la connexion au serveur.'))
      .finally(() => setLoadingUsers(false));
  }, []);

  const doLogin = async () => {
    if (loading || !selUser) return;
    setErr('');
    setLoading(true);
    try {
      await onLogin(selUser, pwd);
    } catch (e) {
      setErr(e.message || 'Identifiant ou mot de passe incorrect');
      setPwd('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', fontFamily: "'DM Sans',system-ui,sans-serif", background: '#060D18', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '70%', background: 'radial-gradient(ellipse,rgba(0,135,90,.12) 0%,transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse,rgba(0,101,255,.08) 0%,transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* LEFT: Branding */}
      <div style={{ width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px 64px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: T.greenBg, border: `2px solid ${T.greenBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic n="package" s={24} c={T.brand} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: .2 }}>MRDPSTOCK</div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' }}>{companyName || 'M.R.D.P.S 27'}</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 520 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,135,90,.15)', border: '1px solid rgba(0,135,90,.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 36, width: 'fit-content' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.brand }} />
            <span style={{ color: T.brand, fontSize: 12, fontWeight: 600, letterSpacing: .5 }}>Gestion de stock professionnelle</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: -.5 }}>
            MRDPSTOCK
          </h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 15, lineHeight: 1.8 }}>
            Gérez vos bases de stock, suivez vos articles et pilotez vos alertes depuis un seul espace centralisé.
          </p>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'shield', label: 'Accès sécurisé par rôles (Admin / Utilisateur / Lecture seule)' },
              { icon: 'server', label: 'Données persistantes sur serveur — aucune perte' },
              { icon: 'history', label: 'Historique complet de toutes les actions' },
            ].map(f => (
              <div key={f.icon} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,.35)', fontSize: 13 }}>
                <Ic n={f.icon} s={14} c={T.brand} />
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.18)' }}>© 2025 MRDPSTOCK — {companyName || 'M.R.D.P.S 27'}. Tous droits réservés.</div>
      </div>

      {/* RIGHT: Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: 44, boxShadow: '0 40px 80px rgba(0,0,0,.5)' }}>
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Connexion</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, lineHeight: 1.6 }}>Accédez à votre espace de gestion</p>
            </div>

            {loadingUsers ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                <div style={{ width: 28, height: 28, border: '3px solid rgba(0,135,90,.2)', borderTopColor: T.brand, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 8 }}>Compte utilisateur</label>
                  <select value={selUser} onChange={e => { setSelUser(e.target.value); setErr(''); setPwd(''); }}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 11, border: `1.5px solid ${err ? '#f87171' : 'rgba(255,255,255,.12)'}`, background: 'rgba(255,255,255,.07)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                    {users.map(u => (
                      <option key={u.id} value={u.id} style={{ background: '#1a2a3a', color: '#fff' }}>
                        {u.name} — {u.role === 'admin' ? 'Admin' : u.role === 'viewer' ? 'Lecture seule' : 'Utilisateur'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 8 }}>Mot de passe</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPwd ? 'text' : 'password'} value={pwd}
                      onChange={e => { setPwd(e.target.value); setErr(''); }}
                      onKeyDown={e => e.key === 'Enter' && doLogin()}
                      placeholder="••••••••" autoFocus
                      style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 11, border: `1.5px solid ${err ? '#f87171' : 'rgba(255,255,255,.12)'}`, background: 'rgba(255,255,255,.07)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                    <button onClick={() => setShowPwd(!showPwd)} type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'rgba(255,255,255,.3)' }}>
                      <Ic n={showPwd ? 'eyeoff' : 'eye'} s={16} c="rgba(255,255,255,.4)" />
                    </button>
                  </div>
                  {err && <div style={{ marginTop: 8, fontSize: 12, color: '#f87171', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><Ic n="alert" s={12} c="#f87171" />{err}</div>}
                </div>

                <button onClick={doLogin} disabled={loading || !selUser} type="button"
                  style={{ width: '100%', padding: 14, borderRadius: 11, background: loading ? 'rgba(0,135,90,.5)' : `linear-gradient(135deg,${T.brand},${T.brandHov})`, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', letterSpacing: .3, boxShadow: '0 4px 20px rgba(0,135,90,.4)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  {loading ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Connexion...</> : 'Se connecter'}
                </button>
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.2)' }}>
              Connexion sécurisée — Données chiffrées sur serveur
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
