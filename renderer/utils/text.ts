export interface FluentdMessage {
  log: string;
  stream: string; // 'stderr'
  docker: {
    container_id: string; // '9a7c466ea95a91cf8104cf7a0b921bd39d6911d8cfc114d244376ff84923adc7'
  };
  kubernetes: {
    container_name: string; // 'register-face-to-guest-table-kube-001'
    namespace_name: string; // 'default'
    pod_name: string; // 'register-face-to-guest-table-kube-001-868d96b686-kfsmc'
    pod_id: string; // 'b1a9f5b5-9a9f-49bb-83b5-a1e733f49518'
    pod_ip: string; // '10.244.0.106'
    host: string; // 'mercury'
  };
}

export interface PodMessage {
  level: string; // 'DEBUG'
  cursor: string; // '/path/to/the/source.py#L123'
  timestamp: string; // python: '2021/11/06 09:05:51'
}

export interface RegisterFaceToGuestTableKubeMessage extends PodMessage {
  message: string; // 'updateGuest succeeded'
  params: {
    guest_id: number; // 4
    face_id: string; // '894e5bc1-47d3-44fb-b55f-80afabeb6cc9'
  };
}

const warning = (e: Error, msg: unknown) => {
  console.error('error in creeateMessage:', e, 'msg:', msg);
};

const processRegisterFaceToGuestTableKubeMessage = (msg: FluentdMessage) => {
  const podMsg = JSON.parse(msg.log) as RegisterFaceToGuestTableKubeMessage;
  if (podMsg.message !== 'updateGuest succeeded') {
    throw new Error('unknown message: ' + podMsg.message);
  }

  return `お客様 ${podMsg.params.guest_id} に顔情報が登録されました`;
};

export const createText = (msg: unknown): string | null => {
  try {
    const fluentdMsg = msg as FluentdMessage;
    switch (fluentdMsg.kubernetes.container_name) {
      case 'register-face-to-guest-table-kube-001':
        return processRegisterFaceToGuestTableKubeMessage(fluentdMsg);
      default:
        throw new Error('unknown container_name: ' + fluentdMsg.kubernetes.container_name);
    }
  } catch (e) {
    warning(e, msg);
    return null;
  }
};
