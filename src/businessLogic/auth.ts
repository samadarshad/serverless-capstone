import { OnMessageAction } from "src/requests/onMessageAction"
import { DomainErrors } from "./errors"

const requiresAuthorization = (request: OnMessageAction) => request.postedAt ? true : false

const userIsAuthorized = (userId: string, request: OnMessageAction) => {
    return (request.userId === userId)
}

export function authorize(request: OnMessageAction, userId: string) {
    if (requiresAuthorization(request) && !userIsAuthorized(userId, request)) {
        throw new Error(DomainErrors.Unauthorized)
    }
}