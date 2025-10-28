import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TemperatureSensorService } from './temperature-sensors.service';
import { CreateTemperatureSensorDto } from './dto/create-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temp-sensor.dto';

@ApiTags('sensors')
@Controller('sensors')
export class TemperatureSensorsController {
  constructor(private readonly sensorsService: TemperatureSensorService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all temperature sensors' })
  @ApiResponse({ status: 200, description: 'List of temperature sensors returned.' })
  getAll() {
    return this.sensorsService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get temperature sensor by ID' })
  @ApiParam({ name: 'id', description: 'Sensor ID' })
  @ApiResponse({ status: 200, description: 'Temperature sensor returned.' })
  getOne(@Param('id') id: string) {
    return this.sensorsService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new temperature sensor' })
  @ApiBody({ type: CreateTemperatureSensorDto })
  @ApiResponse({ status: 201, description: 'Sensor successfully created.' })
  createTemp(@Body() dto: CreateTemperatureSensorDto) {
    return this.sensorsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update entire temperature sensor by ID' })
  @ApiParam({ name: 'id', description: 'Sensor ID' })
  @ApiBody({ type: UpdateTemperatureSensorDto })
  updateOne(@Param('id') id: string, @Body() dto: UpdateTemperatureSensorDto) {
    return this.sensorsService.update(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update temperature sensor by ID' })
  @ApiParam({ name: 'id', description: 'Sensor ID' })
  @ApiBody({ type: UpdateTemperatureSensorDto })
  partialUpdate(@Param('id') id: string, @Body() dto: Partial<UpdateTemperatureSensorDto>) {
    return this.sensorsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete temperature sensor by ID' })
  @ApiParam({ name: 'id', description: 'Sensor ID' })
  @ApiResponse({ status: 204, description: 'Sensor successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.sensorsService.remove(id);
  }
}
