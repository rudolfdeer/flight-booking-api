import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Ticket } from '../ticket/ticket.entity';

@Entity({ name: 'Profile' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  createdAt: string;

  @Column({ nullable: false })
  updatedAt: string;

  @Column({ nullable: false, default: false })
  isAdmin: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.profile)
  @JoinColumn()
  bookedTickets: Ticket[];
}
