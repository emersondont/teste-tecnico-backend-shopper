import { Api } from "../api";
import express, { Express, NextFunction, Request, Response } from "express";
import { ValidationChain } from 'express-validator';

export class ApiExpress implements Api {
    private constructor(readonly app: Express) { }

    public static build() {
        const app = express();
        app.use(express.json());
        return new ApiExpress(app);
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log("Server runing on port " + port);
        });
    }

    public addGetRoute(
        path: string,
        validations: ValidationChain[],
        handler: (req: Request, res: Response) => void
    ): void {
        this.app.get(path, this.validate(validations), handler);
    }

    public addPatchRoute(
        path: string,
        validations: ValidationChain[],
        handler: (req: Request, res: Response) => void
    ): void {
        this.app.patch(path, this.validate(validations), handler);
    }

    public addPostRoute(
        path: string,
        validations: ValidationChain[],
        handler: (req: Request, res: Response) => void
    ): void {
        this.app.post(path, this.validate(validations), handler);
    }

    private validate(validations: ValidationChain[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const errors = []
            for (const validation of validations) {
                const result = await validation.run(req);
                if (!result.isEmpty()) {
                    errors.push(result.array());
                }
            }
            if (errors.length > 0) {
                const errorsString = errors.map((error) =>
                    error.map((e) => e.msg)
                        .join(", "))
                    .join(", ");

                return res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: errorsString
                }).send();
            }
            next();
        };
    }
}