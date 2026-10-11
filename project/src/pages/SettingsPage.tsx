import { useState } from 'react';
import { Save, FlaskConical, Thermometer, Droplets, Waves, Check } from 'lucide-react';
import type { ParameterKey, Settings, Threshold } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';
import { PageHeader, Section } from '@/components/PageHeader';

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
}

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
    <div className="max-w-5xl">
      <PageHeader
        eyebrow="Konfigurasi"
        title="Settings"
        desc="Konfigurasi koneksi dan ambang batas parameter"
      />

      <div className="mt-6 lg:mt-10">
        {/* Connection config */}
        <Section title="Konfigurasi Koneksi" desc="Alamat server dan parameter koneksi">
          <div className="space-y-6">
            {draft.connectionMode === 'websocket' && (
              <Field label="Alamat WebSocket" hint="contoh: ws://192.168.1.100:81">
                <input
                  type="text"
                  value={draft.serverUrl}
                  onChange={(e) => update({ serverUrl: e.target.value })}
                  className="input"
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
                    className="input"
                    placeholder="ws://broker.hivemq.com:8000/mqtt"
                  />
                </Field>
                <Field label="Topic Subscribe" hint="Topic yang dipublikasikan oleh ESP32">
                  <input
                    type="text"
                    value={draft.mqttTopic}
                    onChange={(e) => update({ mqttTopic: e.target.value })}
                    className="input"
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
                  className="input"
                  placeholder="http://192.168.1.100/data"
                />
              </Field>
            )}
            {draft.connectionMode === 'firebase' && (
              <>
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Database URL" hint="URL Realtime Database dari Firebase Console">
                      <input
                        type="text"
                        value={draft.firebase.databaseURL}
                        onChange={(e) =>
                          update({ firebase: { ...draft.firebase, databaseURL: e.target.value } })
                        }
                        className="input"
                        placeholder="https://<project>-default-rtdb.firebaseio.com"
                      />
                    </Field>
                  </div>
                  <Field label="API Key">
                    <input
                      type="text"
                      value={draft.firebase.apiKey}
                      onChange={(e) =>
                        update({ firebase: { ...draft.firebase, apiKey: e.target.value } })
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="Project ID">
                    <input
                      type="text"
                      value={draft.firebase.projectId}
                      onChange={(e) =>
                        update({ firebase: { ...draft.firebase, projectId: e.target.value } })
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="App ID">
                    <input
                      type="text"
                      value={draft.firebase.appId}
                      onChange={(e) =>
                        update({ firebase: { ...draft.firebase, appId: e.target.value } })
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="Auth Domain">
                    <input
                      type="text"
                      value={draft.firebase.authDomain}
                      onChange={(e) =>
                        update({ firebase: { ...draft.firebase, authDomain: e.target.value } })
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="Storage Bucket">
                    <input
                      type="text"
                      value={draft.firebase.storageBucket}
                      onChange={(e) =>
                        update({ firebase: { ...draft.firebase, storageBucket: e.target.value } })
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="Messaging Sender ID">
                    <input
                      type="text"
                      value={draft.firebase.messagingSenderId}
                      onChange={(e) =>
                        update({ firebase: { ...draft.firebase, messagingSenderId: e.target.value } })
                      }
                      className="input"
                    />
                  </Field>
                </div>
                <Callout>
                  Dashboard membaca node <code className="font-mono text-primary">/sensor</code> di Firebase
                  Realtime Database. Pastikan ESP32 menulis ke node tersebut dan rules dalam keadaan
                  read/write terbuka (test mode).
                </Callout>
              </>
            )}
            {draft.connectionMode === 'demo' && (
              <Callout>
                Mode demo menghasilkan data simulasi otomatis. Tidak perlu konfigurasi server.
              </Callout>
            )}

            <Field label="Frekuensi Update" hint="Interval pengambilan data (milidetik)">
              <div className="flex h-[46px] items-center gap-4 border border-line px-4">
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={500}
                  value={draft.updateIntervalMs}
                  onChange={(e) => update({ updateIntervalMs: Number(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="w-14 text-right font-display text-label-lg tabular-nums text-ink">
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
                <div key={p} className="card p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="icon-box">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-display text-label-lg text-ink">{PARAMETER_META[p].label}</p>
                      <p className="eyebrow">satuan: {PARAMETER_META[p].unit || PARAMETER_META[p].unitLabel || 'pH'}</p>
                    </div>
                  </div>
                  {PARAMETER_META[p].rangeOnly ? (
                    // Tanpa batas aman/waspada: batas waspada mengikuti rentang nilai
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <NumberField label="Nilai Min" value={t.min} onChange={(v) => updateThreshold(p, { min: v, warningMin: v })} />
                      <NumberField label="Nilai Max" value={t.max} onChange={(v) => updateThreshold(p, { max: v, warningMax: v })} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <NumberField label="Min Aman" value={t.min} onChange={(v) => updateThreshold(p, { min: v })} />
                      <NumberField label="Max Aman" value={t.max} onChange={(v) => updateThreshold(p, { max: v })} />
                      <NumberField label="Min Waspada" value={t.warningMin} onChange={(v) => updateThreshold(p, { warningMin: v })} />
                      <NumberField label="Max Waspada" value={t.warningMax} onChange={(v) => updateThreshold(p, { warningMax: v })} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-4 border-t border-line bg-surface py-4">
        <button onClick={handleSave} className="btn btn-primary">
          <Save className="h-4 w-4" strokeWidth={1.5} />
          Simpan Pengaturan
        </button>
        {saved && (
          <span className="chip chip-ok animate-fade-in-up" role="status">
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Pengaturan tersimpan. Koneksi dimuat ulang.
          </span>
        )}
      </div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-primary bg-primary-10 p-4 text-body-sm text-ink">{children}</div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-display text-label-md text-ink">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-body-sm text-muted">{hint}</p>}
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="eyebrow mb-1.5 block">{label}</label>
      <input
        type="number"
        value={value}
        step={0.1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input font-display tabular-nums"
      />
    </div>
  );
}
