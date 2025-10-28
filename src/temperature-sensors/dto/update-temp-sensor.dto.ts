import { PartialType } from '@nestjs/mapped-types';
import { CreateTemperatureSensorDto } from './create-sensor.dto';

export class UpdateTemperatureSensorDto extends PartialType(CreateTemperatureSensorDto) {}
