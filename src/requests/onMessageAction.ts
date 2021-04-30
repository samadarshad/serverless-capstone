export interface OnMessageAction {
    room: string
    message?: string
    postedAt?: string
    isDeleted?: boolean
    userId?: string
}
