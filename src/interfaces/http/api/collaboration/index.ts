// src/interfaces/http/api/collaboration/index.ts

import { Router } from "express";
import { Container } from "instances-container";
import { routes } from "./routes";
import { CollaborationHandler } from "./handler";
import { AddCollaborationUseCase } from "@/applications/usecase/collaboration/add-collaboration";
import { RemoveCollaborationUseCase } from "@/applications/usecase/collaboration/remove-collaboration";

export const collaborationApi = (container: Container): Router => {
    const router = Router();

    const addCollaborationUseCase = container.getInstance(AddCollaborationUseCase.name) as AddCollaborationUseCase;
    const removeCollaborationUseCase = container.getInstance(RemoveCollaborationUseCase.name) as RemoveCollaborationUseCase;

    const collaborationHandler = new CollaborationHandler(addCollaborationUseCase, removeCollaborationUseCase);

    routes(router, collaborationHandler);

    return router;
};
