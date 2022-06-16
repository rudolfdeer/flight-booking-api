import { Ticket } from 'lib/modules/ticket/ticket.entity';
import { getConnection, MigrationInterface, QueryRunner } from 'typeorm';
import ticketsSeed from '../seeds/tickets.seed';

export class createTickets1645445675066 implements MigrationInterface {
  public async up(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Ticket)
      .values(ticketsSeed)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Ticket');
  }
}
