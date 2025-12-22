import { Injectable, NotFoundException } from '@nestjs/common';
import { SensorStore } from './store/temperature-sensors.store';
import { TemperatureSensorsType } from '@/types';
import { CreateTemperatureSensorDto } from './dto/create-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temp-sensor.dto';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/utils/db';
import { SseService } from '@/utils/sse.service';

@Injectable()
export class TemperatureSensorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sseService: SseService,
  ) {}

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

  async create(sensor: CreateTemperatureSensorDto) {
    const newSensor: TemperatureSensorsType = {
      ...sensor,
      timestamp: new Date(),
      id: randomUUID(),
    };

    try {
      const created = await this.prisma.sensor.create({
        data: newSensor,
      });

      // If the temperature value is below the critical threshold, emit an SSE
      // so frontends subscribed to the stream can show a tooltip/notification.
      try {
        if (typeof created.value === 'number' && created.value < 20) {
          this.sseService.emit('critical-temp', {
            id: created.id,
            sensorName: created.sensorName,
            value: created.value,
            timestamp: created.timestamp,
          });
        }
      } catch (emitErr) {
        // Don't fail the request if emitting the event fails — just log it.
        // eslint-disable-next-line no-console
        console.error('Failed to emit SSE critical-temp event', emitErr);
      }

      return created;
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
