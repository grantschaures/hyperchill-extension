// Global Type Definitions
export type TempStorage = { 
    contentsId: string | null; 
    blockedModuleId: string | null; 
};

export const tempStorage: TempStorage = {
    contentsId: null,
    blockedModuleId: null
};