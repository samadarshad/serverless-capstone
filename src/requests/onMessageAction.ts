export interface OnMessageAction {
    room: string
    message?: string
    postedAt: string
    isDeleted?: boolean
    userId?: string
}

export interface OnMessageActionInternal extends OnMessageAction {
    modifiedAt?: string
}
