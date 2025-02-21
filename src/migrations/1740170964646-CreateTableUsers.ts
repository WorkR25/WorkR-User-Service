import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1740170964646 implements MigrationInterface {
    name = 'CreateTableUsers1740170964646';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."users_role_enum" AS ENUM(\'admin\')');
        await queryRunner.query('CREATE TYPE "public"."users_user_type_enum" AS ENUM(\'jobseeker\', \'employer\')');
        await queryRunner.query('CREATE TYPE "public"."users_user_status_enum" AS ENUM(\'active\', \'in-active\')');
        await queryRunner.query('CREATE TYPE "public"."users_jobseeker_type_enum" AS ENUM(\'fresher\', \'experienced\')');
        await queryRunner.query('CREATE TABLE "users" ("id" SERIAL NOT NULL, "full_name" character varying(40) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum", "mobile_number" character varying(20) NOT NULL, "user_type" "public"."users_user_type_enum" NOT NULL, "user_status" "public"."users_user_status_enum" NOT NULL DEFAULT \'in-active\', "jobseeker_type" "public"."users_jobseeker_type_enum", "company_name" character varying, "designation" character varying, "headquarter_location" character varying(40), "current_company" character varying, "current_office_location" character varying(20), "years_of_experience" integer, "interested_domain" text array, "institute_name" character varying, "years_of_graduation" integer, "hometown_state" character varying, "resume_link" character varying, "profile_img_link" character varying, "company_website_link" character varying, "github_profile_link" character varying, "linkedin_profile_link" character varying, "twitter_profile_link" character varying, "number_of_employees" character varying, "industry_type" character varying, "comapny_type" character varying, "company_about" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "public"."users_jobseeker_type_enum"');
        await queryRunner.query('DROP TYPE "public"."users_user_status_enum"');
        await queryRunner.query('DROP TYPE "public"."users_user_type_enum"');
        await queryRunner.query('DROP TYPE "public"."users_role_enum"');
    }

}
