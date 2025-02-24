import { FastifyInstance } from 'fastify';

import userController from '../../controllers/userController';
import { createAdminRoleZodSchema, createUserZodSchema, getApplicantDetailsZodSchema, getUserZodSchema, updateAccountDetailsZodSchema, updateEmployerZodSchema, updateJobseekerZodSchema, updateUserIdZodSchema } from '../../dtos/UserDto';
import { validator } from '../../validators/validateRequest';
import { validateToken } from '../../validators/validateToken';

async function userRoute(fastify: FastifyInstance) {
    fastify.post('/signup', {
        preValidation: validator({ body: createUserZodSchema })
    }, userController.signup);

    fastify.post('/signin', {
        preValidation: validator({ body: getUserZodSchema })
    }, userController.signin);

    fastify.post('/applicants', {
        preValidation: validateToken,
        preHandler: validator({ body: getApplicantDetailsZodSchema })
    }, userController.getAllApplicantDetails);

    fastify.post('/:id/upload-resume', {
        preValidation: validateToken,
        preHandler: validator({ params: updateUserIdZodSchema })
    }, userController.uploadResume);

    fastify.post('/:id/upload-profile-image', {
        preValidation: validateToken,
        preHandler: validator({ params: updateUserIdZodSchema })
    }, userController.uploadProfileImage);

    fastify.post('/upload-company-logo', {
        preValidation: validateToken
    }, userController.uploadCompanyLogo);

    fastify.get('/:id', {
        preValidation: validateToken,
        preHandler: validator({ params: updateUserIdZodSchema })
    }, userController.getUser);

    fastify.put('/:id/employer', {
        preValidation: validateToken,
        preHandler: validator({ body: updateEmployerZodSchema, params: updateUserIdZodSchema })
    }, userController.updateEmployer);

    fastify.put('/:id/jobseeker', {
        preValidation: validateToken,
        preHandler: validator({ body: updateJobseekerZodSchema, params: updateUserIdZodSchema})
    }, userController.updateJobseeker);

    fastify.patch('/:id/account', {
        preValidation: validateToken,
        preHandler: validator({ body: updateAccountDetailsZodSchema, params: updateUserIdZodSchema })
    }, userController.updateUserAccount);

    fastify.patch('/adminrole', {
        preValidation: validateToken,
        preHandler: validator({ body: createAdminRoleZodSchema })
    }, userController.makeAdminRole);

}

export default userRoute;