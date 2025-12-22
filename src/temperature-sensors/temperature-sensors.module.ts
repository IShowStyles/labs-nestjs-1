import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './temperature-sensors.service';
import { TemperatureSensorsController } from './temperature-sensors.controller';
import { SensorStore } from './store/temperature-sensors.store';
import { SseService } from '@/utils/sse.service';
import { PrismaService } from '@/utils/db';

@Module({
  providers: [TemperatureSensorService, SensorStore, SseService, PrismaService],
  controllers: [TemperatureSensorsController],
})
export class TemperatureSensorsModule {}
