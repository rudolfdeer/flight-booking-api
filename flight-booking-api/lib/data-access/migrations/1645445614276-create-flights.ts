import { Flight } from 'lib/modules/flight/flight.entity';
import { getConnection, MigrationInterface, QueryRunner } from 'typeorm';
import flightsSeed from '../seeds/flights.seed';

export class createFlights1645445614276 implements MigrationInterface {
  public async up(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Flight)
      .values(flightsSeed)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Flight');
  }
}
