import { z } from 'zod';

import { JOBSEEKER_TYPE } from '../utils/enums/JobseekerType';
import { USER_ROLE } from '../utils/enums/UserRole';
import { USER_STATUS } from '../utils/enums/UserStatus';
import { USER_TYPE } from '../utils/enums/UserType';

export const createUserZodSchema = z.object({
    fullName: z.string(),
    email: z.string(),
    password: z.string(),
    mobileNumber: z.string(),
    role: z.nativeEnum(USER_ROLE).optional(),
    userType: z.nativeEnum(USER_TYPE),
    companyName: z.string().optional(),
    designation: z.string().optional()
});

export const getUserZodSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const updateEmployerZodSchema = z.object({
    id: z.number(),
    userStatus: z.nativeEnum(USER_STATUS),
    linkedInProfile: z.string(),
    numberOfEmployees: z.string(),
    companyType: z.string(),
    companyAbout: z.string(),
    headquarterLocation: z.string(),
    twitterProfile: z.string().optional(),
    profileImage: z.string().optional(),
    industryType: z.string().optional(),
    companyWebsite: z.string(),
});

export const updateJobseekerZodSchema = z.object({
    id: z.number(),
    jobseekerType: z.nativeEnum(JOBSEEKER_TYPE),
    userStatus: z.nativeEnum(USER_STATUS),
    interestedDomain: z.array(z.string()).optional(),
    instituteName: z.string().optional(),
    yearOfGraduation: z.number().optional(),
    githubProfile: z.string().optional(),
    linkedInProfile: z.string().optional(),
    profileImage: z.string().optional(),
    currentCompany: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    currentOfficeLocation: z.string().optional(),
    twitterProfile: z.string().optional(),
    hometownState: z.string().optional()
});

export const updateAccountDetailsZodSchema = z.object({
    fullName: z.string().optional(),
    companyName: z.string().optional(),
    designation: z.string().optional(),
    email: z.string().optional(),
    currentPassword: z.string().optional(),
    updatePassword: z.string().optional(),
    mobileNumber: z.string().optional()
});

export const getApplicantDetailsZodSchema = z.object({
    applicantIds: z.array(z.number())
});

export const createAdminRoleZodSchema = z.object({
    adminEmail: z.string(),
    employerEmail: z.string()
});

export const updateUserIdZodSchema = z.object({
    id: z.string()
});

export type CreateUserDto = z.infer<typeof createUserZodSchema>

export type GetUserDto = z.infer<typeof getUserZodSchema>

export type GetApplicantDto = z.infer<typeof getApplicantDetailsZodSchema>

export type UpdateEmployerDto = z.infer<typeof updateEmployerZodSchema>

export type UpdateJobseekerDto = z.infer<typeof updateJobseekerZodSchema>

export type UpdateAccountDto = z.infer<typeof updateAccountDetailsZodSchema>

export type UpdateUserId = z.infer<typeof updateUserIdZodSchema>

export type CreateAdminDto = z.infer<typeof createAdminRoleZodSchema>