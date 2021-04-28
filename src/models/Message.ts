import { SendMessageRequest } from 'src/requests/sendMessageRequest';

export interface Message extends SendMessageRequest {
    name: string
}
