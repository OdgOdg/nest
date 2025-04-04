import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SightsData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  addr1: string;

  @Column({ nullable: true })
  addr2: string;

  @Column({ type: 'float', nullable: true })
  dist: number;

  @Column({ nullable: true })
  firstimage: string;

  @Column({ nullable: true })
  firstimage2: string;

  @Column({ type: 'float', nullable: true })
  mapx: number;

  @Column({ type: 'float', nullable: true })
  mapy: number;

  @Column({ nullable: true })
  tel: string;
}
