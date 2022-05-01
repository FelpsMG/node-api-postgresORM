import { AppDataSource } from "./data-source"
import { port } from "./config"
import app from "./app"


AppDataSource.initialize().then(async () => {
    app.listen(port)
    console.log(`Express server has started on port ${port}. Open http://localhost:${port} to see results`)
}).catch(error => console.log(error))



//     // insert new users for test
//     // await AppDataSource.manager.save(
//     //     AppDataSource.manager.create(User, {
//     //         firstName: "Timber",
//     //         lastName: "Saw",
//     //         age: 27
//     //     })
//     // )
// JEST SUPERTEST IS USE TO TEST DE APP
