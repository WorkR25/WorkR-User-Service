import { FastifyInstance } from 'fastify';

import userController from '../../controllers/userController';
import { createUserZodSchema, getUserZodSchema } from '../../dtos/UserDto';
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
        preValidation: validateToken
    }, userController.getAllApplicantDetails);

    fastify.post('/:id/upload-resume', {
        preValidation: validateToken
    }, userController.uploadResume);

    fastify.post('/:id/upload-profile-image', {
        preValidation: validateToken
    }, userController.uploadProfileImage);

    fastify.post('/upload-company-logo', {
        preValidation: validateToken
    }, userController.uploadCompanyLogo);

    fastify.get('/:id', {
        // preValidation: validateToken
    }, userController.getUser);

    fastify.put('/:id/employer', {
        preValidation: validateToken
    }, userController.updateEmployer);

    fastify.put('/:id/jobseeker', {
        preValidation: validateToken
    }, userController.updateJobseeker);

    fastify.patch('/:id/account', {
        preValidation: validateToken
    }, userController.updateUserAccount);

    fastify.patch('/adminrole', {
        preValidation: validateToken
    }, userController.makeAdminRole);

}

export default userRoute;