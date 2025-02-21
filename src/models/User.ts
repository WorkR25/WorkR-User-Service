import bcrypt from 'bcrypt';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import serverConfig from '../configs/serverConfig';
import { JOBSEEKER_TYPE } from '../utils/enums/JobseekerType';
import { USER_ROLE } from '../utils/enums/UserRole';
import { USER_STATUS } from '../utils/enums/UserStatus';
import { USER_TYPE } from '../utils/enums/UserType';

const { SALT_ROUNDS } = serverConfig;

@Entity({ name: 'users' })
class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
        id: number;

    @Column({ name: 'full_name', length: 40 })
        fullName: string;

    @Column({ unique: true })
        email: string;

    @Column()
        password: string;

    @Column({ type: 'enum', enum: USER_ROLE, nullable: true })
        role: USER_ROLE;

    @Column({ name: 'mobile_number', length: 20 })
        mobileNumber: string;

    @Column({ name: 'user_type', type: 'enum', enum: USER_TYPE })
        userType: USER_TYPE;

    @Column({ name: 'user_status', type: 'enum', enum: USER_STATUS, default: USER_STATUS.IN_ACTIVE })
        userStatus: USER_STATUS;

    @Column({ name: 'jobseeker_type', type: 'enum', enum: JOBSEEKER_TYPE, nullable: true })
        jobseekerType: JOBSEEKER_TYPE;

    @Column({ name: 'company_name', nullable: true })
        companyName: string;

    @Column({ nullable: true })
        designation: string;

    @Column({ name: 'headquarter_location', length: 40, nullable: true })
        headquarterLocation: string;

    @Column({ name: 'current_company',  nullable: true })
        currentCompany: string;

    @Column({ name: 'current_office_location', length: 20,  nullable: true })
        currentOfficeLocation: string;

    @Column({ name: 'years_of_experience', nullable: true })
        yearsOfExperience: number;

    @Column({ name: 'interested_domain', type: 'text', array: true, nullable: true })
        interestedDomain: string[];

    @Column({ name: 'institute_name', nullable: true })
        instituteName: string;

    @Column({ name: 'years_of_graduation', nullable: true })
        yearOfGraduation: number;

    @Column({ name: 'hometown_state', nullable: true })
        hometownState: string;

    @Column({ name: 'resume_link', nullable: true })
        resumeLink: string;

    @Column({ name: 'profile_img_link', nullable: true })
        profileImage: string;

    @Column({ name: 'company_website_link', nullable: true })
        companyWebsite: string;

    @Column({ name: 'github_profile_link', nullable: true })
        githubProfile: string;

    @Column({ name: 'linkedin_profile_link', nullable: true })
        linkedInProfile: string;

    @Column({ name: 'twitter_profile_link', nullable: true })
        twitterProfile: string;

    @Column({ name: 'number_of_employees', nullable: true })
        numberOfEmployees: string;

    @Column({ name: 'industry_type', nullable: true })
        industryType: string;

    @Column({ name: 'comapny_type', nullable: true })
        companyType: string;

    @Column({ name: 'company_about', nullable: true })
        companyAbout: string;

    @BeforeInsert()
    async encryptPassword() {
        if(this.password) {
            const encryptedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
            this.password = encryptedPassword;
        }
    }

    @CreateDateColumn({ name: 'created_at' })
        createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
        updatedAt: Date;
}

export default User;