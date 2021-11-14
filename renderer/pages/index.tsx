import { useEffect, useState } from 'react';
import s from './index.module.scss';
import { Sidebar } from '../components/Sidebar';
import { Settings } from '../components/Settings';
import { createText } from '../utils/text';
import { sleep } from '../utils/sleep';

import canon from '../public/canon.png';

const IndexPage = () => {
  const [text, setText] = useState<string | null>(null);
  const [moveToRight, setMoveToRight] = useState(false);
  const [isRightDisplaying, setIsRightDisplaying] = useState(false);

  useEffect(() => {
    // RabbitMQ からメッセージを受信したときの処理を定義
    const receiverId = window.rabbitmq.addReceiver((msg: unknown) => {
      console.log('Message received:', msg);

      // 受け取ったメッセージをもとに表示用テキストを作成
      const message = createText(msg);
      if (message !== null) {
        setText(message);
      }
    });

    // ページのアンロード時:
    // 受信処理の登録解除
    return () => {
      window.rabbitmq.removeReceiver(receiverId);
    };
  }, []);

  // 右側のスライドする UI の DOM ツリーへの登録・削除
  //
  // 設定画面の情報などを一旦初期化するために、
  // 完全に画面から表示されなくなったとき DOM ツリーから削除する
  useEffect(() => {
    (async () => {
      if (moveToRight) {
        setIsRightDisplaying(true);
        return;
      }

      // 消えるまでのアニメーションの時間分: 800 ms
      await sleep(800);
      setIsRightDisplaying(false);
    })();
  }, [moveToRight]);

  return (
    <div className={s.box}>
      <div className={`${s.containerHome}  ${moveToRight && s.moveToRight}`}>
        <div className={s.left}>
          <Sidebar setMoveToRight={setMoveToRight} />
        </div>
        <div className={s.right}>
          <div className={s.top}>
            <div className={s.arrowBox}>
              {text === null ? (
                <>
                  A new Guest with Face Id is registered!
                  <br />
                  20's female, ...
                </>
              ) : (
                text
              )}
            </div>
            <div className={s.canon}>
              <img src={canon} width={360} height={360} />
            </div>
          </div>
          <div className={s.bottom}>
            <div className={s.bottom1}></div>
            <div className={s.bottom2}></div>
            <div className={s.bottom3}></div>
          </div>
        </div>
      </div>

      {isRightDisplaying && <Settings setMoveToRight={setMoveToRight} />}
    </div>
  );
};

export default IndexPage;
