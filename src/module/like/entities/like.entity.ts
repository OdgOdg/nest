import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  sightId: number;

  @Column({ default: false })
  isLiked: boolean;
}
