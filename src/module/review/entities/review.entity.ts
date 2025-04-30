import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sightId: number; // 관광지, 행사 Id

  @Column()
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'json', nullable: true }) // 선택된 장점들을 JSON 형태로 저장
  advantages: number[]; // 선택된 장점 ID들을 배열로 저장
}
