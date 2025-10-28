import { Injectable, NotFoundException } from '@nestjs/common';
import { SensorStore } from './store/temperature-sensors.store';
import { TemperatureSensorsType } from '@/types';
import { CreateTemperatureSensorDto } from './dto/create-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temp-sensor.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TemperatureSensorService {
  constructor(private readonly store: SensorStore) {}

  async getAll() {
    return await firstValueFrom(this.store.getSensors());
  }

  getOne(id: string) {
    const sensor = this.store.getOne(id);
    if (!sensor) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }
    return sensor;
  }

  create(sensor: CreateTemperatureSensorDto) {
    const newSensor: TemperatureSensorsType = {
      ...sensor,
      timestamp: new Date(),
    };
    this.store.upsertSensor(newSensor);
    return newSensor;
  }

  update(id: string, sensor: Partial<UpdateTemperatureSensorDto>) {
    const existing = this.store.getOne(id);
    if (!existing) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }

    const updatedSensor: TemperatureSensorsType = {
      ...existing,
      ...sensor,
      id,
    };

    this.store.upsertSensor(updatedSensor);
    return updatedSensor;
  }

  remove(id: string) {
    const existing = this.store.getOne(id);
    if (!existing) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }

    this.store.removeSensor(id);
    return { message: `Sensor ${id} deleted.` };
  }
}
