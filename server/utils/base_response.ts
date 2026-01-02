function success(result: any) {
    return {
        success: true,
        result
    }
}

function failure(errorMessage: string, errorCode?: number) {
    return {
        success: false,
        errorMessage,
        errorCode: errorCode || 500
    }
}

export { success, failure };