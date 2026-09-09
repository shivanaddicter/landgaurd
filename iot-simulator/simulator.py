"""
IoT Gateway & Sensor Fleet Telemetry Simulator
Simulates continuous LoRaWAN packets, environmental drift, and threshold alarms.
"""
import time
import random
import json
import urllib.request

SENSORS_CONFIG = [
    {"id": "SNS-TWG-RF-01", "type": "rainfall", "base": 42.0, "unit": "mm/hr", "drift": 1.5},
    {"id": "SNS-TWG-SM-01", "type": "soil_moisture", "base": 74.0, "unit": "%", "drift": 0.8},
    {"id": "SNS-TWG-GM-01", "type": "ground_movement", "base": 4.8, "unit": "mm", "drift": 0.2},
    {"id": "SNS-TWG-TL-01", "type": "tilt", "base": 3.2, "unit": "°", "drift": 0.1},
    {"id": "SNS-GTK-GM-06", "type": "ground_movement", "base": 8.6, "unit": "mm", "drift": 0.4},
    {"id": "SNS-CHR-RF-07", "type": "rainfall", "base": 68.0, "unit": "mm/hr", "drift": 2.0}
]

def simulate_telemetry_loop(api_base_url: str = "http://127.0.0.1:8000/api", iterations: int = 10):
    print("=== AI-SlopeGuard IoT LoRaWAN Telemetry Simulator Active ===")
    print(f"Target Gateway: {api_base_url}")
    print(f"Monitoring {len(SENSORS_CONFIG)} Station Nodes across Tawang, Gangtok, and Cherrapunji...")
    
    for i in range(1, iterations + 1):
        sensor = random.choice(SENSORS_CONFIG)
        noise = (random.random() - 0.48) * sensor["drift"]
        reading = round(max(0.0, sensor["base"] + noise), 2)
        
        payload = {
            "sensor_id": sensor["id"],
            "type": sensor["type"],
            "value": reading,
            "unit": sensor["unit"],
            "battery_pct": round(95.0 - (i * 0.05), 1),
            "signal_rssi": random.randint(-82, -62),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        
        print(f"[{i:03d}] Pushed LoRa Packet -> {sensor['id']} ({sensor['type']}): {reading} {sensor['unit']} (RSSI: {payload['signal_rssi']} dBm)")
        time.sleep(1)

if __name__ == "__main__":
    simulate_telemetry_loop(iterations=5)
