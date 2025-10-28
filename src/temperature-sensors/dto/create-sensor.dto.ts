import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTemperatureSensorDto {
  @IsUUID()
  id:string;

  @IsString()
  @IsNotEmpty()
  sensorName: string;

  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}
