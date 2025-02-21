import { DeepPartial, In } from 'typeorm';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import User from '../models/User';
import CrudRepository from './CrudRepository';

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(email: string) {
        const user = await User.findOneBy({ email });
        return user;
    }

    async updateEmployerRole(email: string, data: DeepPartial<User>) {
        await User.update({ email }, data);
    }

    async updateFile(id: number, data: DeepPartial<User>) {
        const updatedData = await User.update(id, data);

        if(updatedData.affected == 0) {
            throw new NotFoundError('Id', `${id}`);
        }
        
        const response = await User.findOne({
            where: { id },
        });

        if(!response) {
            throw new BadRequestError('User not found', { response });
        }

        return response;
    }

    async getAllApplicationDetailsByApplicationIds(applicantIds: number[]) {
        const applicants = await User.find({
            where: {
                id: In(applicantIds)
            },
            select: {
                profileImage: true,
                fullName: true,
                email: true,
                mobileNumber: true,
                resumeLink: true,
                linkedInProfile: true
            }
        });

        return applicants;
    }
}

export default UserRepository;