import { DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';

import dataSource from '../dataSource';
import NotFoundError from '../errors/NotFoundError';
import User from '../models/User';

class CrudRepository {
    private repository;

    constructor(entity: EntityTarget<User>) {
        this.repository = dataSource.getRepository(entity);
    }

    async create(data: DeepPartial<ObjectLiteral>) {
        const entity = this.repository.create(data);
        return await this.repository.save(entity);
    }

    async getAll() {
        const response = await this.repository.find();
        return response;
    }

    async get(id: number, columnName: string) {
        const response = await this.repository.findOne({
            where: { id }
        });

        if(!response) {
            throw new NotFoundError(columnName, `${id}`);
        }

        return response;
    }

    async update(id: number, data: DeepPartial<ObjectLiteral>) {
        const updatedData = await this.repository.update(id, data);

        if(updatedData.affected == 0) {
            throw new NotFoundError('Id', `${id}`);
        }
        
        const response = await this.repository.findOne({
            where: { id }
        });

        return response;
    }

    async destroy(id: number) {
        const response = await this.repository.findOne({
            where: { id }
        });

        if(!response) {
            throw new NotFoundError('Id', `${id}`);
        }

        await this.repository.delete(id);
        return response;
    }
}

export default CrudRepository;