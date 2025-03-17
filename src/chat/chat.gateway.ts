import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() data: { name: string }) {
    const room = await this.chatService.createRoom(data.name);
    this.server.emit('roomCreated', room);
    return room;
  }

  @SubscribeMessage('getRooms')
  async getRooms() {
    return this.chatService.getRooms();
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: number; sender: string; message: string },
  ) {
    const message = await this.chatService.saveMessage(
      data.roomId,
      data.sender,
      data.message,
    );
    this.server.to(`room_${data.roomId}`).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(`room_${roomId}`);
    // 채팅 기록을 가져와서 클라이언트에 전송
    const messages = await this.chatService.getMessages(roomId);
    this.server.to(`room_${roomId}`).emit('chatHistory', messages);
  }
}
