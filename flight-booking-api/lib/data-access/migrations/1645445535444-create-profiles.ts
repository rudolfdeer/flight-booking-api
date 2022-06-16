import { Profile } from 'lib/modules/profile/profile.entity';
import { getConnection, MigrationInterface, QueryRunner } from 'typeorm';
import profilesSeed from '../seeds/profiles.seed';

export class createProfiles1645445535444 implements MigrationInterface {
  public async up(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Profile)
      .values(profilesSeed)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Profile');
  }
}
