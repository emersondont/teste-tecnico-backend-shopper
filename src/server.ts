import { ApiExpress } from "./api/express/api.express";
import { MeasureController } from "./api/express/controllers/measure.controller";
import { confirmValidations, uploadValidations } from "./validations/validation";

function main() {
    const api = ApiExpress.build();

    const controller = MeasureController.build();

    api.addPostRoute("/upload", uploadValidations, controller.create);
    api.addPatchRoute("/confirm", confirmValidations, controller.confirm);
    api.addGetRoute("/:customer_code/list", [], controller.list);

    api.start(3000);
}

main();