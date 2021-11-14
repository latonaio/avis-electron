import s from './Settings.module.scss';
import { IoArrowBack } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { RabbitmqConnectionConfig } from '../../types/rabbitmq';

export interface SettingsProps {
  setMoveToRight: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Settings = ({ setMoveToRight }: SettingsProps) => {
  const [config, setConfig] = useState<RabbitmqConnectionConfig>({} as RabbitmqConnectionConfig);

  useEffect(() => {
    (async () => {
      const config = await window.rabbitmq.getConnectionConfig();
      setConfig(config);
    })();
  }, []);

  return (
    <div className={s.settings}>
      <button className={s.backHome} onClick={() => setMoveToRight(false)}>
        H<br />O<br />M<br />E<br />
        <IoArrowBack className={s.arrowBack} />
      </button>
      <div className={s.contents}>
        <div className={s.form}>
          <div className={s.left}>
            <div className="inputNinja">
              <input
                type="text"
                required
                value={config.host}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    host: e.target.value,
                  });
                }}
              />
              <label>ホスト名</label>
            </div>
            <div className="inputNinja">
              <input
                type="text"
                required
                value={config.virtualHost}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    virtualHost: e.target.value,
                  });
                }}
              />
              <label>バーチャルホスト名</label>
            </div>
            <div className="inputNinja">
              <input
                type="text"
                required
                value={config.user}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    user: e.target.value,
                  });
                }}
              />
              <label>ユーザー名</label>
            </div>
          </div>
          <div className={s.right}>
            <div className="inputNinja">
              <input
                type="number"
                required
                value={config.port}
                min={0}
                max={65535}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    port: Number(e.target.value),
                  });
                }}
              />
              <label>ポート番号</label>
            </div>
            <div className="inputNinja">
              <input
                type="text"
                required
                value={config.queueOrigin}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    queueOrigin: e.target.value,
                  });
                }}
              />
              <label>キュー名</label>
            </div>
            <div className="inputNinja">
              <input
                type="password"
                required
                value={config.passwd}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    passwd: e.target.value,
                  });
                }}
              />
              <label>パスワード</label>
            </div>
          </div>
        </div>
        <div className={s.buttons}>
          <button
            className={s.button1}
            onClick={() => {
              setMoveToRight(false);
            }}
          >
            キャンセル
          </button>
          <button
            className={s.button2}
            onClick={() => {
              window.rabbitmq.setConnectionConfig(config);
              setMoveToRight(false);
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
