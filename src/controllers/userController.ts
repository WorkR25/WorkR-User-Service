import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { CreateAdminDto, CreateUserDto, GetApplicantDto, GetUserDto, UpdateAccountDto, UpdateEmployerDto, UpdateJobseekerDto, UpdateUserId } from '../dtos/UserDto';
import SuccessResponse from '../utils/common/SuccessResponse';

async function signup(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    const requestBody = req.body as CreateUserDto;
    try {
        const response = await this.userService.signup(requestBody);
        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function signin(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const requestBody = req.body as GetUserDto;
        const response = await this.userService.signin(requestBody);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error; 
    }
}

async function info(this: FastifyInstance, _req: FastifyRequest, res: FastifyReply) {
    try {
        SuccessResponse.message = 'API is alive';
        SuccessResponse.data = {};
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function updateEmployer(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const requestBody = req.body as UpdateEmployerDto;
        const requestParams = req.params as UpdateUserId;
        const response = await this.userService.updateEmployerProfile(requestParams.id, requestBody);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function updateJobseeker(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const requestBody = req.body as UpdateJobseekerDto;
        const requestParams = req.params as UpdateUserId;
        const response = await this.userService.updateJobseekerProfile(requestParams.id, requestBody);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function updateUserAccount(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const requestBody = req.body as UpdateAccountDto;
        const requestParams = req.params as UpdateUserId;
        const response = await this.userService.updateAccountDetails(requestParams.id, requestBody);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function makeAdminRole(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const requestBody = req.body as CreateAdminDto;
        await this.userService.makeAdminRole(requestBody);
        SuccessResponse.data = { message: 'Successfully made this employer an admin' };
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function getUser(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const requestParams = req.params as UpdateUserId;
        const response = await this.userService.getUser(requestParams.id);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function getAllApplicantDetails(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const requestBody = req.body as GetApplicantDto;
        const response = await this.userService.getAllApplicantDetails(requestBody.applicantIds);

        if(response.length == 0) {
            SuccessResponse.message = 'No applications found for this job';
            SuccessResponse.data = response;
            return res.status(StatusCodes.NOT_FOUND).send(SuccessResponse);
        }

        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function uploadResume(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const data = await req.file();
        const requestParams = req.params as UpdateUserId;
        const response = await this.userService.uploadResume(requestParams.id, data);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function uploadProfileImage(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const data = await req.file();
        const requestParams = req.params as UpdateUserId;
        const response = await this.userService.uploadProfileImage(requestParams.id, data);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

async function uploadCompanyLogo(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        const data = await req.file();
        const response = await this.userService.uploadCompanyLogo(data);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).send(SuccessResponse);
    } catch (error) {
        throw error;
    }
}

export default {
    signup,
    signin,
    info,
    updateEmployer,
    updateJobseeker,
    updateUserAccount,
    makeAdminRole,
    getUser,
    getAllApplicantDetails,
    uploadResume,
    uploadProfileImage,
    uploadCompanyLogo
};