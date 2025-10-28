import { BehaviorSubject, Observable } from 'rxjs';
import { TemperatureSensorsType } from '@/types';

export class SensorStore {
  private sensors = new Map<string, TemperatureSensorsType>();
  private sensors$ = new BehaviorSubject<TemperatureSensorsType[]>([]);

  constructor() {
    const mock: TemperatureSensorsType = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      sensorName: 'Test Sensor',
      value: 22.5,
      unit: '°C',
      timestamp: new Date(),
    };
    this.upsertSensor(mock);
  }

  getSensors(): Observable<TemperatureSensorsType[]> {
    return this.sensors$.asObservable();
  }

  getOne(id: string): TemperatureSensorsType | undefined {
    return this.sensors.get(id);
  }

  upsertSensor(sensor: TemperatureSensorsType) {
    this.sensors.set(sensor.id, sensor);
    this.emit();
  }

  removeSensor(id: string) {
    this.sensors.delete(id);
    this.emit();
  }

  private emit() {
    this.sensors$.next(Array.from(this.sensors.values()));
  }
}
