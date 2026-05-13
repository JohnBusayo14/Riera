import Pusher from 'pusher-js';

// Configuration using the keys from your backend setup [cite: 2026-01-28]
const PusherConfig = {
  AppKey: 'c3cd2956b8cdcf13133a',
  Cluster: 'mt1',
  ForceTLS: true
};

const PusherClient = new Pusher(PusherConfig.AppKey, {
  cluster: PusherConfig.Cluster,
  forceTLS: PusherConfig.ForceTLS,
});

export default PusherClient;