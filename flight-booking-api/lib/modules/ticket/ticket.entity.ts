import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Flight } from '../flight/flight.entity';
import { Profile } from '../profile/profile.entity';

@Entity({ name: 'Ticket' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  flightId: number;

  @Column({ nullable: true })
  profileId: number;

  @Column({ nullable: false })
  rank: string;

  @Column({ nullable: false, default: true })
  isAvaliable: boolean;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  createdAt: string;

  @ManyToOne(() => Profile, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => Flight, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  flight: Flight;
}
