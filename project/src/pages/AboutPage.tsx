import { Droplets, Thermometer, FlaskConical, Waves, Cpu } from 'lucide-react';
import type { ParameterKey } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';
import { PageHeader, Section } from '@/components/PageHeader';

const PARAM_CARDS: { key: ParameterKey; icon: typeof Droplets; range: string }[] = [
  { key: 'tds', icon: Droplets, range: '0–300 ppm (ideal), < 500 ppm (aman)' },
  { key: 'temperature', icon: Thermometer, range: '18–28 °C (ideal), 15–30 °C (aman)' },
  { key: 'ph', icon: FlaskConical, range: '7.0–8.0 (ideal), 6.5–8.5 (aman)' },
  { key: 'turbidity', icon: Waves, range: '0–3000' },
];

export function AboutPage() {
  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow="Tentang"
        title="Tentang Sistem"
        desc="Penjelasan parameter dan cara kerja monitoring kualitas air"
      />

      <div className="mt-6 lg:mt-10">
        {/* Overview */}
        <section className="flex flex-col gap-6 border-t border-line py-10 animate-fade-in-up sm:flex-row sm:items-start lg:gap-10">
          <div className="icon-box h-14 w-14 border-primary bg-primary text-white">
            <Cpu className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-headline-md text-ink sm:text-headline-lg">AquaMonitor ESP32</h2>
            <p className="mt-4 max-w-3xl text-body-md text-muted sm:text-body-lg">
              Sistem monitoring kualitas air berbasis ESP32 yang mengukur empat parameter utama
              secara real-time. Data dikirim dari sensor ke dashboard melalui WebSocket, MQTT, atau
              REST API, lalu ditampilkan dalam bentuk kartu, grafik, dan tabel riwayat.
            </p>
          </div>
        </section>

        {/* Parameters */}
        <Section title="Parameter" desc="Empat parameter kualitas air yang dipantau">
          <div className="cell-grid grid-cols-1 md:grid-cols-2">
            {PARAM_CARDS.map((p) => {
              const Icon = p.icon;
              const meta = PARAMETER_META[p.key];
              return (
                <div key={p.key} className="flex flex-col p-4 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="icon-box">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-label-lg text-ink">{meta.label}</h3>
                      <p className="eyebrow">Satuan: {meta.unit || meta.unitLabel || 'pH'}</p>
                    </div>
                  </div>
                  <p className="text-body-sm text-muted">{meta.description}</p>
                  <div className="mt-auto pt-4">
                    <div className="bg-primary-10 px-3 py-2">
                      <p className="text-body-sm text-primary">
                        <span className="font-display">Rentang nilai:</span> {p.range}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ESP32 payload format */}
        <Section title="Format Data ESP32" desc="Struktur payload JSON dari perangkat">
          <p className="mb-4 text-body-md text-muted">
            ESP32 harus mengirim data dalam format JSON dengan field berikut:
          </p>
          <pre className="overflow-x-auto border border-line bg-neutral/30 p-4 font-mono text-body-sm text-ink">
{`{
  "tds": 180.5,
  "temperature": 25.3,
  "ph": 7.2,
  "turbidity": 1.8,
  "timestamp": 1691234567890
}`}
          </pre>
          <p className="mt-4 text-body-sm text-muted">
            Field <code className="font-mono text-primary">timestamp</code> opsional — jika kosong, dashboard akan
            menggunakan waktu penerimaan. Nama field tidak case-sensitive.
          </p>
        </Section>
      </div>
    </div>
  );
}
