import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemperatureSensorsModule } from './temperature-sensors/temperature-sensors.module';

@Module({
  imports: [TemperatureSensorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
