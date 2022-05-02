
import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User, socioambientais } from "../entity/User"


export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private socioRepository = AppDataSource.getRepository(socioambientais)

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

    async find_intersection(request: Request, response: Response, next: NextFunction) {

        const point = {
            type: "Point",
            coordinates: [parseFloat(request.params.long), parseFloat(request.params.lat)],
        }

        const intersection = await this.socioRepository
            .createQueryBuilder('socioambientais')
            .where("st_intersects(geom, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(geom)))")
            .setParameters({
                // stringify GeoJSON
                origin: JSON.stringify(point),
            })
            .getMany();

        // forma alternativa1
        // const intersection1 = await this.socioRepository
        //     .createQueryBuilder('socioambientais')
        //     .where(`st_intersects('SRID=4674;Point( ${parseFloat(request.params.long)} ${parseFloat(request.params.lat)} )'::geometry,geom)`).getMany()
        // forma alternativa 2
        // const intersection = await AppDataSource.query( `SELECT * FROM socioambientais WHERE st_intersects('SRID=4674;Point( ${parseFloat(request.params.long)} ${parseFloat(request.params.lat)} )'::geometry,socioambientais.geom)`)

        let inconformidades = {
            tipos: [],
            nomes: []
        }
        
        if (intersection.length === 0) return { "conformidade": "Conforme!" }
        else {
            intersection.forEach(intersect => {
                inconformidades.tipos.push(intersect.tipo)
                inconformidades.nomes.push(intersect.nome)
            })
            return {"conformidade": inconformidades}
        }

    }

}