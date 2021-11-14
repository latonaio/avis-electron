import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import 'destyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.scss';
import s from './_app.module.scss';

const App = ({ Component, pageProps, router }: AppProps) => {
  // 表示サイズをウィンドウサイズに合わせて動的に変更する
  useEffect(() => {
    const resizeFunc = () => {
      const pageWidth = 1920;
      const pageHeight = 1080;

      const ratioWidth = window.innerWidth / pageWidth;
      const ratioHeight = window.innerHeight / pageHeight;
      const ratio = Math.min(ratioWidth, ratioHeight);
      document.documentElement.style.setProperty('--app-scale-ratio', String(ratio));
    };

    resizeFunc();
    window.addEventListener('resize', resizeFunc, false);

    return () => {
      window.removeEventListener('resize', resizeFunc, false);
    };
  }, []);

  // ウィンドウ時のみ独自ウィンドウボタンを表示させる
  // フルスクリーン時は OS 標準のボタンを表示させる
  const [osButtonVisible, setOsButtonVisible] = useState(true);
  useEffect(() => {
    const fullscreenFunc = (isFullscreen: boolean) => {
      // フルスクリーン時 true: OS のウィンドウボタンを表示する
      setOsButtonVisible(isFullscreen);
    };

    const receiverId = window.app.addFullscreenReceiver(fullscreenFunc);
    window.app.isFullscreen().then(fullscreenFunc);

    return () => {
      window.app.removeFullscreenReceiver(receiverId);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Avis</title>
      </Head>

      {!osButtonVisible && (
        <>
          <div className={s.macButtons}>
            <div className={s.buttonContainer}>
              <button className={s.button1} onClick={() => window.app.minimize()} />
            </div>
            <div className={s.buttonContainer}>
              <button className={s.button2} onClick={() => window.app.toggleMaximize()} />
            </div>
            <div className={s.buttonContainer}>
              <button className={s.button3} onClick={() => window.app.close()} />
            </div>
          </div>
          <div className={s.windowsButtons}>
            <div className={s.windowsButton1}>_</div>
            <div className={s.windowsButton2}>□</div>
            <div className={s.windowsButton3}>×</div>
          </div>
        </>
      )}

      <div className={s.mainApp}>
        <div className={s.mainAppInner}>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
};

export default App;
