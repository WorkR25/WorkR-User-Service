import { PutObjectCommand } from '@aws-sdk/client-s3';
import { MultipartFile } from '@fastify/multipart';
import { FastifyError } from 'fastify';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { QueryFailedError } from 'typeorm';

import { s3 } from '../configs/awsConfig';
import serverConfig from '../configs/serverConfig';
import { CreateAdminDto, CreateUserDto, GetUserDto, UpdateAccountDto, UpdateEmployerDto, UpdateJobseekerDto } from '../dtos/UserDto';
import BadRequestError from '../errors/BadRequestError';
import BaseError from '../errors/BaseError';
import InternalServerError from '../errors/InternalServerError';
import NotFoundError from '../errors/NotFoundError';
import UnauthorizedError from '../errors/UnauthorizeError';
import UserRepository from '../repositories/UserRepository';
import auth from '../utils/common/auth';
import { USER_ROLE } from '../utils/enums/UserRole';
import { USER_TYPE } from '../utils/enums/UserType';

class UserService {
    private userRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    // async getUser(id: number) {
    //     try {
    //         const user = await this.userRepository.get(id, 'userId');
    //         return user;
    //     } catch (error) {
    //         console.log('get user in error', error);
    //         if(error instanceof BaseError) throw error;
    //         throw new InternalServerError('Can not get the user', error);
    //     }
    // }

    async getUser(id: number) {
        console.log('getUser function called with ID:', id);
        try {
            const user = await this.userRepository.get(id, 'userId');
            console.log('DB Query Executed');
            return user;
        } catch (error) {
            console.log('get user error', error);
            if (error instanceof BaseError) throw error;
            throw new InternalServerError('Can not get the user', error);
        }
    }

    async signup(data: CreateUserDto) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            if(error instanceof QueryFailedError && error.driverError.code == '23505') {
                throw new BadRequestError(`${data.email} is already exists`, error);
            }
            throw new InternalServerError('Can not create the user', error);
        }
    }

    async signin(data: GetUserDto) {
        try {
            const user = await this.userRepository.getUserByEmail(data.email);
            if(!user) {
                throw new NotFoundError('email', data.email);
            }
            const passwordMatch = await auth.checkPassword(data.password, user.password);
            if(!passwordMatch) {
                throw new BadRequestError('Incorrect password', { password: data.password });
            }
            const jwt = auth.createToken({ id: user.id, email: user.email });
            return jwt;
        } catch (error) {
            console.log('sign in error', error);
            if(error instanceof BaseError) throw error;
            throw new InternalServerError('Can not get the user', error);
        }
    }

    async isAuthenticated(token: string) {
        try {
            if(!token) {
                throw new BadRequestError('Missing JWT token', { token: undefined });
            }
            const response = auth.verifyToken(token);
            const user = await this.userRepository.get(response.id, 'userId');
            if(!user) {
                throw new BadRequestError('No user found', { user: null });
            }

            return user.id;
        } catch (error) {
            console.log('is auth', error);
            if(error instanceof BaseError) throw error;

            if(error instanceof TokenExpiredError) {
                throw new UnauthorizedError('JWT token expired, Please sign in again', { token });
            }

            if(error instanceof JsonWebTokenError) {
                throw new UnauthorizedError('Invalid JWT token', { token });
            }

            throw new InternalServerError('Something', {error: 'is auth'});
        }
    }

    async updateEmployerProfile(id: number, data: UpdateEmployerDto) {
        try {
            const employer = await this.userRepository.update(id, data);
            if(!employer) {
                throw new NotFoundError('employerId', `${id}`);
            }
            return employer;
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new InternalServerError('Something went wrong', {});
        }
    }

    async updateJobseekerProfile(id: number, data: UpdateJobseekerDto) {
        try {
            const jobseeker = await this.userRepository.update(id, data);
            if(!jobseeker) {
                throw new NotFoundError('jobseekerId', `${id}`);
            }
            return jobseeker;
        } catch (error) {
            console.log(error);
            if(error instanceof BaseError) throw error;
            throw new InternalServerError('Something went wrong', {});
        }
    }

    async updateAccountDetails(id: number, data: UpdateAccountDto) {
        try {
            if(data.currentPassword) {
                const user = await this.userRepository.get(id, 'userId');
                const passwordMatch = await auth.checkPassword(data.currentPassword, user.password);
                if(!passwordMatch) {
                    throw new BadRequestError('Current Password is Invalid', { currentPassword: data.currentPassword });
                }
            }
            const updatedData = {
                fullName: data.fullName,
                email: data.email,
                mobileNumber: data.mobileNumber,
                ...(data.updatePassword && { password: await auth.hashPassword(data.updatePassword) }),
                comapanyName: data.companyName,
                designation: data.designation
            };
            const user = await this.userRepository.update(id, updatedData);
            if(!user) {
                throw new NotFoundError('userId', `${id}`);
            }
            return user;
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new InternalServerError('Something went wrong', {});
        }
    }

    async makeAdminRole(data: CreateAdminDto) {
        try {
            await this.validateAdmin(data.adminEmail);
            await this.validateEmployer(data.employerEmail);

            await this.updateEmployerRole(data.employerEmail, USER_ROLE.ADMIN);
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new InternalServerError('Something went wrong', {});
        }
    }

    async getAllApplicantDetails(applicantIds: number[]) {
        try {
            const applicants = await this.userRepository.getAllApplicationDetailsByApplicationIds(applicantIds);
            return applicants;
        } catch (error) {
            throw new InternalServerError('Can not get all the applicants', error);
        }
    }

    async uploadResume(id: number, data: MultipartFile | undefined) {
        try {
            if(!data) {
                throw new BadRequestError('No file uploaded', { data });
            }
    
            const bucketName = serverConfig.AWS_S3_BUCKET_NAME as string;
            const fileBuffer = await data.toBuffer();
            const fileKey = `uploads/${Date.now()}-${data.filename}`;
    
            const uploadParams = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: data.mimetype,
                ACL: 'public-read'
            });
            await s3.send(uploadParams);
            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
            const user = await this.userRepository.updateFile(id, { resumeLink: fileUrl });
            return user;
        } catch (error) {
            const err = error as FastifyError;
            if(err.code == 'FST_REQ_FILE_TOO_LARGE') {
                throw new BadRequestError('File size should be less than 3 MB', { allowedFileSize: '3MB' });
            }
            throw new InternalServerError('Can not update the resume', error);
        }
    }

    async uploadProfileImage(id: number, data: MultipartFile | undefined) {
        try {
            if(!data) {
                throw new BadRequestError('No file uploaded', { data });
            }
    
            const bucketName = serverConfig.AWS_S3_BUCKET_NAME as string;
            const fileBuffer = await data.toBuffer();
            const fileKey = `uploads/${Date.now()}-${data.filename}`;
    
            const uploadParams = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: data.mimetype,
                ACL: 'public-read'
            });
            await s3.send(uploadParams);
            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
            const user = await this.userRepository.updateFile(id, { profileImage: fileUrl });
            return user;
        } catch (error) {
            const err = error as FastifyError;
            if(err.code == 'FST_REQ_FILE_TOO_LARGE') {
                throw new BadRequestError('File size should be less than 3 MB', { allowedFileSize: '3MB' });
            }
            throw new InternalServerError('Can not update the resume', error);
        }
    }

    async uploadCompanyLogo(data: MultipartFile | undefined) {
        try {
            if(!data) {
                throw new BadRequestError('No file uploaded', { data });
            }
    
            const bucketName = serverConfig.AWS_S3_BUCKET_NAME as string;
            const fileBuffer = await data.toBuffer();
            const fileKey = `uploads/${Date.now()}-${data.filename}`;
    
            const uploadParams = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: data.mimetype,
                ACL: 'public-read'
            });
            await s3.send(uploadParams);
            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
            return fileUrl;
        } catch (error) {
            const err = error as FastifyError;
            if(err.code == 'FST_REQ_FILE_TOO_LARGE') {
                throw new BadRequestError('File size should be less than 3 MB', { allowedFileSize: '3MB' });
            }
            throw new InternalServerError('Can not update the resume', error);
        }
    }

    private async updateEmployerRole(email: string, role: USER_ROLE) {
        try {
            await this.userRepository.updateEmployerRole(email, { role });
        } catch (error) {
            throw new InternalServerError('Can not update the role', error);
        }
    }

    private async validateAdmin(email: string) {
        const admin = await this.userRepository.getUserByEmail(email);
        if(!admin) {
            throw new NotFoundError('admin', email);
        }
        if(admin.role != USER_ROLE.ADMIN) {
            throw new BadRequestError('This user is not an admin, can not make admin another', { expected: USER_ROLE.ADMIN, provided: admin.role });
        }
    }

    private async validateEmployer(email: string) {
        const employer = await this.userRepository.getUserByEmail(email);
        if(!employer) {
            throw new NotFoundError('employer', email);
        }
        if(employer.userType != USER_TYPE.EMPLOYER) {
            throw new BadRequestError('This user is not an employer, can not give the admin role', { expected: USER_TYPE.EMPLOYER, provided: employer.userType });
        }
        if(employer.role == USER_ROLE.ADMIN) {
            throw new BadRequestError('This employer is already an admin', { expected: null, recieved: employer.role });
        }
    }
}

export default UserService;