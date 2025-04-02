import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom)
  room: ChatRoom;

  @Column()
  sender: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
