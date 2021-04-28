import hello from '@functions/hello';
import sendMessage from '@functions/sns/onMessage';
import connect from '@functions/websocket/connect';
import disconnect from '@functions/websocket/disconnect';
import onJoin from '@functions/websocket/onJoin';
import onMessage from '@functions/websocket/onMessage';

export default {
  hello,
  connect,
  disconnect,
  onMessage,
  sendMessage,
  onJoin,
}