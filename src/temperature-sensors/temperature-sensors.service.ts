import { Injectable, NotFoundException } from '@nestjs/common';
import { SensorStore } from './store/temperature-sensors.store';
import { TemperatureSensorsType } from '@/types';
import { CreateTemperatureSensorDto } from './dto/create-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temp-sensor.dto';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/utils/db';

@Injectable()
export class TemperatureSensorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.sensor.findMany();
  }

  async getOne(id: string) {
    try {
      const sen = await this.prisma.sensor.findUnique({
        where: {
          id: id,
        },
      });
      if (!sen) {
        return [];
      }
      return sen;
    } catch (err) {
      throw new Error(err);
    }
  }

  create(sensor: CreateTemperatureSensorDto) {
    const newSensor: TemperatureSensorsType = {
      ...sensor,
      timestamp: new Date(),
      id: randomUUID(),
    };

    try {
      return this.prisma.sensor.create({
        data: newSensor,
      });
    } catch (err) {
      throw new Error(`Failed to create sensor: ${err}`);
    }
  }

  async update(id: string, sensor: Partial<UpdateTemperatureSensorDto>) {
    const existing = await this.prisma.sensor.findUnique({
      where: {
        id: id,
      },
    });
    if (!existing) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }

    const updatedSensor: TemperatureSensorsType = {
      ...existing,
      ...sensor,
      id,
    };

    const data = await this.prisma.sensor.upsert({
      where: { id },
      create: updatedSensor,
      update: sensor,
    });

    return data;
  }

  async remove(id: string) {
    const existing = await this.prisma.sensor.findUnique({
      where: {
        id: id,
      },
    });
    if (!existing) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }

    return { message: `Sensor ${id} deleted.` };
  }
}
