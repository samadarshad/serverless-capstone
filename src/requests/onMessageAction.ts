export interface OnMessageAction {
    room: string
    message?: string
    postedAt?: string
    subAction: string
    connectionId: string
}
