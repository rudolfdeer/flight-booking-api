import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'Flight' })
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  time: string;

  @Column({ nullable: false })
  departurePoint: string;

  @Column({ nullable: false })
  destinationPoint: string;

  @Column({ nullable: false })
  priceEconomy: number;

  @Column({ nullable: false })
  priceBusiness: number;

  @Column({ nullable: false })
  priceDeluxe: number;

  @Column({ nullable: false })
  totalTicketsEconomy: number;

  @Column({ nullable: false })
  totalTicketsBusiness: number;

  @Column({ nullable: false })
  totalTicketsDeluxe: number;

  @Column({ nullable: false })
  avaliableTicketsEconomy: number;

  @Column({ nullable: false })
  avaliableTicketsBusiness: number;

  @Column({ nullable: false })
  avaliableTicketsDeluxe: number;

  @Column()
  createdAt: string;
}
