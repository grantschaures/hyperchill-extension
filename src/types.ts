// Global Type Definitions
export type TempStorage = { 
    contentsId: string | null; 
    blockedModuleId: string | null; 
    existingWindowId: number | null;
};

export const tempStorage: TempStorage = {
    contentsId: null,
    blockedModuleId: null,
    existingWindowId: null
};

export type AppStorage = {
    loggedIn: boolean;
    userEmail: string | null;
}

export const appStorage: AppStorage = {
    loggedIn: false,
    userEmail: null,
}