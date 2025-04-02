import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  // 방 생성
  async createRoom(name: string) {
    const room = this.chatRoomRepository.create({ name });
    return await this.chatRoomRepository.save(room);
  }

  // 방 목록 가져오기
  async getRooms() {
    return await this.chatRoomRepository.find();
  }

  // 메시지 저장
  async saveMessage(roomId: number, sender: string, message: string) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });
    if (!room) throw new Error('Room not found');
    const chatMessage = this.chatMessageRepository.create({
      room,
      sender,
      message,
    });
    return await this.chatMessageRepository.save(chatMessage);
  }

  // 채팅 기록 가져오기
  async getMessages(roomId: number) {
    return await this.chatMessageRepository.find({
      where: { room: { id: roomId } },
      order: { createdAt: 'ASC' },
    });
  }
}
