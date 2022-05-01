
import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const found = await this.userRepository.findOneBy({
            id: request.params.id
        })
        if (!found) throw Error("user does not exist")
        return found
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const userToRemove = await this.userRepository.findOneBy({ id: request.params.id })
        if (!userToRemove) throw Error("user does not exist")
        await this.userRepository.remove(userToRemove)
    }

}