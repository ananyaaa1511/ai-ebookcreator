export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/profile",
    },
    BOOKS: {
        CREATE_BOOK: "/api/books",
        GET_BOOKS: "/api/books",
        GET_BOOK_BY_ID: "/api/books",
        UPDATE_BOOK: "/api/books",
        DELETE_BOOK: "/api/books",
        UPDATE_COVER: "/api/books/cover",
    },
    AI: {
        GENERATE_OUTLINE: "/api/ai/generate-outline",
        GENERATE_CHAPTER_CONTENT: "/api/ai/generate-chapter-content",
    },
    EXPORT: {
        PDF: "/api/export",
        DOC: "/api/export",
    },
    // Lowercase aliases for convenience
    auth: {
        register: "/auth/register",
        login: "/auth/login",
        getProfile: "/auth/profile",
        updateProfile: "/auth/profile",
    },
    books: {
        create: "/books",
        list: "/books",
        getById: "/books",
        update: "/books",
        delete: "/books",
        uploadCover: "/books/cover",
    },
    ai: {
        generateOutline: "/ai/generate-outline",
        generateContent: "/ai/generate-chapter-content",
    },
    export: {
        pdf: "/export",
        doc: "/export",
    },
};