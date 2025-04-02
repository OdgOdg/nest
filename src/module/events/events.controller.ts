import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/request/CreateEventDto';
import { EventService } from './events.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({
    summary: '이벤트 생성 API',
    description:
      '이벤트 제목, 시작일, 종료일, 메모를 입력하여 새로운 이벤트를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '이벤트가 생성되었습니다.',
    type: Event,
  })
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    summary: '모든 이벤트 조회 API',
    description: '모든 이벤트를 조회하여 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모든 이벤트가 조회되었습니다.',
    type: [Event],
  })
  async getAllEvents(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 이벤트 조회 API',
    description: '특정 이벤트를 조회하여 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '특정 이벤트가 조회되었습니다.',
    type: Event,
  })
  async getEventById(@Param('id') id: number): Promise<Event> {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '특정 이벤트 수정 API',
    description: '특정 이벤트를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '특정 이벤트가 수정되었습니다.',
    type: Event,
  })
  async updateEvent(
    @Param('id') id: number,
    @Body() updateEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 이벤트 삭제 API',
    description: '특정 이벤트를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '특정 이벤트가 삭제되었습니다.',
  })
  async deleteEvent(@Param('id') id: number): Promise<void> {
    return this.eventService.remove(id);
  }
}
