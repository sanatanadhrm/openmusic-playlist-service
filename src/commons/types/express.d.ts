// ✅ BENAR — src/Commons/types/express.d.ts
import { TokenPayload } from "@/commons/types/token";
import "express"; // WAJIB ADA, walau tidak dipakai langsung di file ini — ini yang membuat file jadi "module"

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}