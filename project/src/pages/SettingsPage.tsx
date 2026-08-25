import { useState } from 'react';
import { Save, Wifi, Radio, Cloud, FlaskConical, Thermometer, Droplets, Waves, Database } from 'lucide-react';
import type { ConnectionMode, ParameterKey, Settings, Threshold } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
}

const MODE_OPTIONS: { value: ConnectionMode; label: string; icon: typeof Wifi; desc: string }[] = [
  { value: 'demo', label: 'Demo', icon: FlaskConical, desc: 'Data simulasi untuk uji tampilan' },
  { value: 'websocket', label: 'WebSocket', icon: Wifi, desc: 'Koneksi langsung ke ESP32 via WebSocket' },
  { value: 'mqtt', label: 'MQTT', icon: Radio, desc: 'Subscribe ke broker MQTT' },
  { value: 'rest', label: 'REST API', icon: Cloud, desc: 'Polling endpoint HTTP REST' },
  { value: 'firebase', label: 'Firebase', icon: Database, desc: 'Baca data real-time dari Firebase Realtime Database' },
];

const PARAM_ICONS: Record<ParameterKey, typeof Droplets> = {
  tds: Droplets,
  temperature: Thermometer,
  ph: FlaskConical,
  turbidity: Waves,
};

const PARAMS: ParameterKey[] = ['tds', 'temperature', 'ph', 'turbidity'];

export function SettingsPage({ settings, onSave }: SettingsPageProps) {
  const [draft, setDraft] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setSaved(false);
  };

  const updateThreshold = (key: ParameterKey, patch: Partial<Threshold>) => {
    setDraft((d) => ({
      ...d,
      thresholds: { ...d.thresholds, [key]: { ...d.thresholds[key], ...patch } },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500">Konfigurasi koneksi dan ambang batas parameter</p>
      </div>

      {/* Connection mode */}
      <Section title="Mode Koneksi" desc="Pilih cara dashboard berkomunikasi dengan ESP32">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = draft.connectionMode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update({ connectionMode: opt.value })}
                className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
                  active
                    ? 'bg-cyan-500/15 ring-1 ring-cyan-400/30'
                    : 'glass hover:bg-white/[0.06]'
                }`}
              >
                <div className={`grid place-items-center w-10 h-10 rounded-lg ${active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${active ? 'text-cyan-300' : 'text-slate-200'}`}>{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Connection config */}
      <Section title="Konfigurasi Koneksi" desc="Alamat server dan parameter koneksi">
        <div className="space-y-4">
          {draft.connectionMode === 'websocket' && (
            <Field label="Alamat WebSocket" hint="contoh: ws://192.168.1.100:81">
              <input
                type="text"
                value={draft.serverUrl}
                onChange={(e) => update({ serverUrl: e.target.value })}
                className={inputClass}
                placeholder="ws://192.168.1.100:81"
              />
            </Field>
          )}
          {draft.connectionMode === 'mqtt' && (
            <>
              <Field label="Broker MQTT" hint="contoh: ws://broker.hivemq.com:8000/mqtt atau mqtt://broker:1883">
                <input
                  type="text"
                  value={draft.serverUrl}
                  onChange={(e) => update({ serverUrl: e.target.value })}
                  className={inputClass}
                  placeholder="ws://broker.hivemq.com:8000/mqtt"
                />
              </Field>
              <Field label="Topic Subscribe" hint="Topic yang dipublikasikan oleh ESP32">
                <input
                  type="text"
                  value={draft.mqttTopic}
                  onChange={(e) => update({ mqttTopic: e.target.value })}
                  className={inputClass}
                  placeholder="water/quality"
                />
              </Field>
            </>
          )}
          {draft.connectionMode === 'rest' && (
            <Field label="Endpoint REST API" hint="URL yang mengembalikan JSON data sensor">
              <input
                type="text"
                value={draft.restUrl}
                onChange={(e) => update({ restUrl: e.target.value })}
                className={inputClass}
                placeholder="http://192.168.1.100/data"
              />
            </Field>
          )}
          {draft.connectionMode === 'firebase' && (
            <>
              <Field label="Database URL" hint="URL Realtime Database dari Firebase Console">
                <input
                  type="text"
                  value={draft.firebase.databaseURL}
                  onChange={(e) =>
                    update({ firebase: { ...draft.firebase, databaseURL: e.target.value } })
                  }
                  className={inputClass}
                  placeholder="https://<project>-default-rtdb.firebaseio.com"
                />
              </Field>
              <Field label="API Key">
                <input
                  type="text"
                  value={draft.firebase.apiKey}
                  onChange={(e) =>
                    update({ firebase: { ...draft.firebase, apiKey: e.target.value } })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Project ID">
                <input
                  type="text"
                  value={draft.firebase.projectId}
                  onChange={(e) =>
                    update({ firebase: { ...draft.firebase, projectId: e.target.value } })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="App ID">
                <input
                  type="text"
                  value={draft.firebase.appId}
                  onChange={(e) =>
                    update({ firebase: { ...draft.firebase, appId: e.target.value } })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Auth Domain">
                <input
                  type="text"
                  value={draft.firebase.authDomain}
                  onChange={(e) =>
                    update({ firebase: { ...draft.firebase, authDomain: e.target.value } })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Storage Bucket">
                <input
                  type="text"
                  value={draft.firebase.storageBucket}
                  onChange={(e) =>
                    update({ firebase: { ...draft.firebase, storageBucket: e.target.value } })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Messaging Sender ID">
                <input
                  type="text"
                  value={draft.firebase.messagingSenderId}
                  onChange={(e) =>
                    update({ firebase: { ...draft.firebase, messagingSenderId: e.target.value } })
                  }
                  className={inputClass}
                />
              </Field>
              <div className="glass rounded-xl p-4 text-sm text-slate-400">
                Dashboard membaca node <code className="text-cyan-300">/sensor</code> di Firebase
                Realtime Database. Pastikan ESP32 menulis ke node tersebut dan rules dalam keadaan
                read/write terbuka (test mode).
              </div>
            </>
          )}
          {draft.connectionMode === 'demo' && (
            <div className="glass rounded-xl p-4 text-sm text-slate-400">
              Mode demo menghasilkan data simulasi otomatis. Tidak perlu konfigurasi server.
            </div>
          )}

          <Field label="Frekuensi Update" hint="Interval pengambilan data (milidetik)">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={500}
                max={10000}
                step={500}
                value={draft.updateIntervalMs}
                onChange={(e) => update({ updateIntervalMs: Number(e.target.value) })}
                className="flex-1 accent-cyan-400"
              />
              <span className="text-sm font-medium text-cyan-300 tabular-nums w-20 text-right">
                {(draft.updateIntervalMs / 1000).toFixed(1)}s
              </span>
            </div>
          </Field>
        </div>
      </Section>

      {/* Thresholds */}
      <Section title="Ambang Batas Parameter" desc="Aturan status warna untuk setiap parameter">
        <div className="space-y-4">
          {PARAMS.map((p) => {
            const Icon = PARAM_ICONS[p];
            const t = draft.thresholds[p];
            return (
              <div key={p} className="glass rounded-xl p-4">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="grid place-items-center w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{PARAMETER_META[p].label}</p>
                    <p className="text-[11px] text-slate-500">satuan: {PARAMETER_META[p].unit || 'pH'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <NumberField label="Min Aman" value={t.min} onChange={(v) => updateThreshold(p, { min: v })} />
                  <NumberField label="Max Aman" value={t.max} onChange={(v) => updateThreshold(p, { max: v })} />
                  <NumberField label="Min Waspada" value={t.warningMin} onChange={(v) => updateThreshold(p, { warningMin: v })} />
                  <NumberField label="Max Waspada" value={t.warningMax} onChange={(v) => updateThreshold(p, { warningMax: v })} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Save button */}
      <div className="flex items-center gap-3 sticky bottom-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          Simpan Pengaturan
        </button>
        {saved && (
          <span className="text-sm text-emerald-400 animate-fade-in-up">Pengaturan tersimpan. Koneksi dimuat ulang.</span>
        )}
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 focus:border-cyan-400/30 transition-all';

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl glass-strong p-5 animate-fade-in-up">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-600">{hint}</p>}
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-500 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        step={0.1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 tabular-nums"
      />
    </div>
  );
}
