import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './temperature-sensors.service';
import { TemperatureSensorsController } from './temperature-sensors.controller';
import { SensorStore } from './store/temperature-sensors.store';

@Module({
  providers: [TemperatureSensorService,SensorStore],
  controllers: [TemperatureSensorsController]
})
export class TemperatureSensorsModule {}
