import hello from '@functions/hello';
import connect from '@functions/websocket/connect';
import disconnect from '@functions/websocket/disconnect';
import sendMessage from '@functions/websocket/sendMessage';

export default {
  hello,
  connect,
  disconnect,
  sendMessage
}