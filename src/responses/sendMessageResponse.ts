export interface SendMessageResponse {
    name?: string
    userId: string
    message?: string
    room: string
    postedAt: string
    isDeleted?: boolean
    modifiedAt?: string
}
