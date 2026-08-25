import { Droplets, Thermometer, FlaskConical, Waves, Cpu, Radio, Wifi } from 'lucide-react';
import type { ParameterKey } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';

const PARAM_CARDS: { key: ParameterKey; icon: typeof Droplets; range: string }[] = [
  { key: 'tds', icon: Droplets, range: '0–300 ppm (ideal), < 500 ppm (aman)' },
  { key: 'temperature', icon: Thermometer, range: '18–28 °C (ideal), 15–30 °C (aman)' },
  { key: 'ph', icon: FlaskConical, range: '7.0–8.0 (ideal), 6.5–8.5 (aman)' },
  { key: 'turbidity', icon: Waves, range: '0–3 NTU (ideal), < 5 NTU (aman)' },
];

export function AboutPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Tentang Sistem</h1>
        <p className="text-sm text-slate-500">Penjelasan parameter dan cara kerja monitoring kualitas air</p>
      </div>

      {/* Overview */}
      <div className="rounded-2xl glass-strong p-6 animate-fade-in-up">
        <div className="flex items-start gap-4">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/20 text-cyan-400 ring-1 ring-cyan-400/20 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">AquaMonitor ESP32</h2>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">
              Sistem monitoring kualitas air berbasis ESP32 yang mengukur empat parameter utama
              secara real-time. Data dikirim dari sensor ke dashboard melalui WebSocket, MQTT, atau
              REST API, lalu ditampilkan dalam bentuk kartu, grafik, dan tabel riwayat.
            </p>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PARAM_CARDS.map((p) => {
          const Icon = p.icon;
          const meta = PARAMETER_META[p.key];
          return (
            <div key={p.key} className="rounded-2xl glass-strong p-5 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">{meta.label}</h3>
                  <p className="text-[11px] text-slate-500">Satuan: {meta.unit || 'pH'}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{meta.description}</p>
              <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-400/15">
                <p className="text-xs text-emerald-300">
                  <span className="font-medium">Rentang nilai:</span> {p.range}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection modes */}
      <div className="rounded-2xl glass-strong p-6 animate-fade-in-up">
        <h2 className="text-base font-semibold text-slate-100 mb-4">Mode Koneksi</h2>
        <div className="space-y-3">
          <ConnRow icon={Wifi} title="WebSocket" desc="Koneksi dua arah real-time. Cocok untuk ESP32 yang menjalankan WebSocket server. Data langsung dikirim saat sensor membaca." />
          <ConnRow icon={Radio} title="MQTT" desc="Protokol publish/subscribe ringan. ESP32 mempublikasi data ke topic, dashboard subscribe. Cocok untuk skala IoT." />
          <ConnRow icon={FlaskConical} title="REST API" desc="Dashboard melakukan polling HTTP ke endpoint ESP32 secara berkala. Sederhana namun tidak real-time." />
        </div>
      </div>

      {/* ESP32 payload format */}
      <div className="rounded-2xl glass-strong p-6 animate-fade-in-up">
        <h2 className="text-base font-semibold text-slate-100 mb-2">Format Data ESP32</h2>
        <p className="text-sm text-slate-400 mb-3">
          ESP32 harus mengirim data dalam format JSON dengan field berikut:
        </p>
        <pre className="rounded-xl bg-slate-950/80 border border-white/10 p-4 text-xs text-cyan-300 overflow-x-auto font-mono">
{`{
  "tds": 180.5,
  "temperature": 25.3,
  "ph": 7.2,
  "turbidity": 1.8,
  "timestamp": 1691234567890
}`}
        </pre>
        <p className="mt-3 text-xs text-slate-500">
          Field <code className="text-cyan-400">timestamp</code> opsional — jika kosong, dashboard akan
          menggunakan waktu penerimaan. Nama field tidak case-sensitive.
        </p>
      </div>
    </div>
  );
}

function ConnRow({ icon: Icon, title, desc }: { icon: typeof Wifi; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl glass">
      <div className="grid place-items-center w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
