import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/request/CreateEventDto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  // 이벤트 생성
  async create(createEventDto: CreateEventDto): Promise<Event> {
    if (createEventDto.isAllday) {
      // 하루 종일인 경우, 시간 제거
      createEventDto.startDate = createEventDto.startDate.split('T')[0];
      createEventDto.endDate = createEventDto.endDate.split('T')[0];
    }

    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  // 이벤트 전체 조회
  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  // 이벤트 단일 조회
  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`id ${id}의 event는 없습니다.`);
    }
    return event;
  }

  // 이벤트 수정
  async update(id: number, updateEventDto: CreateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    return this.eventRepository.save({ ...event, ...updateEventDto });
  }

  // 이벤트 삭제
  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }
}
