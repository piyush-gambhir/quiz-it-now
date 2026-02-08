interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
    error: {
        code: number | null;
        message: string | null;
    };
    timestamp: string;
}

export function createApiResponse<T = any>(
    statusCode: number,
    message: string,
    data: T | null = null,
    success: boolean = true,
): ApiResponse<T> {
    return {
        success,
        statusCode,
        message,
        data,
        error: {
            code: success ? null : statusCode,
            message: success ? null : message,
        },
        timestamp: new Date().toISOString(),
    };
}

export function createSuccessResponse<T = any>(
    message: string,
    data: T | null = null,
    statusCode: number = 200,
): ApiResponse<T> {
    return createApiResponse(statusCode, message, data, true);
}

export function createErrorResponse(
    message: string,
    statusCode: number = 500,
): ApiResponse<null> {
    return createApiResponse(statusCode, message, null, false);
}

export function toNextResponse<T = any>(apiResponse: ApiResponse<T>): Response {
    return new Response(JSON.stringify(apiResponse), {
        status: apiResponse.statusCode,
        headers: { 'Content-Type': 'application/json' },
    });
}
