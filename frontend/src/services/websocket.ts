/**
 * WebSocket Telemetry Manager
 * Handles real-time streaming of IoT sensor ticks and early warning broadcasts.
 */

type TelemetryCallback = (data: any) => void;

class TelemetryWebSocket {
  private socket: WebSocket | null = null;
  private listeners: Set<TelemetryCallback> = new Set();
  private reconnectTimeout: number | null = null;
  private mockInterval: number | null = null;

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/telemetry`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[WebSocket] Connected to AI-SlopeGuard Live Telemetry Bus');
        if (this.mockInterval) {
          clearInterval(this.mockInterval);
          this.mockInterval = null;
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notify(data);
        } catch (err) {
          console.error('[WebSocket] Parsing error', err);
        }
      };

      this.socket.onclose = () => {
        console.warn('[WebSocket] Closed, starting simulated fallback stream...');
        this.startFallbackSimulation();
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.socket?.close();
      };
    } catch (e) {
      console.warn('[WebSocket] Connection failed, using simulated ticker');
      this.startFallbackSimulation();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, 6000);
  }

  private startFallbackSimulation() {
    if (this.mockInterval) return;
    this.mockInterval = window.setInterval(() => {
      const sensors = [
        { id: 'SNS-TWG-RF-01', name: 'Pluviometer Station Alpha', loc: 'Tawang', unit: 'mm/hr', base: 42.4 },
        { id: 'SNS-TWG-SM-01', name: 'TDR Saturation Probe', loc: 'Tawang Ridge', unit: '%', base: 74.2 },
        { id: 'SNS-TWG-GM-01', name: 'Wire Extensometer', loc: 'Tawang Toe Bench', unit: 'mm', base: 4.8 },
        { id: 'SNS-GTK-GM-06', name: 'Differential GNSS', loc: 'Gangtok NH-10', unit: 'mm', base: 8.6 }
      ];
      const s = sensors[Math.floor(Math.random() * sensors.length)];
      const jitter = (Math.random() - 0.48) * 0.4;
      const reading = {
        event_type: 'telemetry_tick',
        sensor_id: s.id,
        sensor_name: s.name,
        location: s.loc,
        value: Number((s.base + jitter).toFixed(1)),
        unit: s.unit,
        battery: 92.4,
        timestamp: 'Just now'
      };
      this.notify(reading);
    }, 4000);
  }

  subscribe(callback: TelemetryCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(data: any) {
    this.listeners.forEach((listener) => listener(data));
  }
}

export const telemetryWs = new TelemetryWebSocket();
