import hello from '@functions/hello';
import sendMessage from '@functions/sns/sendMessage';
import connect from '@functions/websocket/connect';
import disconnect from '@functions/websocket/disconnect';
import onMessage from '@functions/websocket/onMessage';

export default {
  hello,
  connect,
  disconnect,
  onMessage,
  sendMessage
}