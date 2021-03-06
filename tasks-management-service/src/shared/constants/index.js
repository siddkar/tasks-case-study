export const HTTP_ERROR_CODE = Object.freeze({
    "401_UNAUTHORIZED": "401_UNAUTHORIZED",
    "403_FORBIDDEN": "403_FORBIDDEN",
    "400_BAD_REQUEST": "400_BAD_REQUEST",
    "404_NOT_FOUND": "404_NOT_FOUND",
    "409_CONFLICT": "409_CONFLICT",
    "500_INTERNAL_SERVER_ERROR": "500_INTERNAL_SERVER_ERROR",
    "422_UNPROCESSABLE_ENTITY": "422_UNPROCESSABLE_ENTITY",
});

export const ERROR_TYPE = Object.freeze({
    UNAUTHORIZED: "UNAUTHORIZED",
    BAD_DATA: "BAD_DATA",
    ENTITY_NOT_FOUND: "ENTITY_NOT_FOUND",
    CONFLICT: "CONFLICT",
    FORBIDDEN: "FORBIDDEN",
    UNPROCESSABLE: "UNPROCESSABLE",
});

export const SCOPE = Object.freeze({
    READ: "READ",
    READ_WRITE: "READ_WRITE",
});
