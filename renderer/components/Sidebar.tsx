import s from './Sidebar.module.scss';
import { Accordion } from 'react-bootstrap';
import { FaCat } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';

export interface SettingsProps {
  setMoveToRight: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ setMoveToRight }: SettingsProps) => {
  return (
    <div className={s.Sidebar}>
      <div className={s.container}>
        <Accordion>
          <Accordion.Item eventKey="1" className={s.itemBlue}>
            <Accordion.Header>
              <FaCat />
              Title1
            </Accordion.Header>
            <Accordion.Body className={s.itemBody}>
              <div className={s.bodysItem}>Cat1</div>
              <div className={s.bodysItem}>Cat2</div>
              <div className={s.bodysItem}>Cat3</div>
              <div className={s.bodysItem}>Cat4</div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={s.itemPink}>
            <Accordion.Header>
              <FaCat />
              Title2
            </Accordion.Header>
            <Accordion.Body className={s.itemBody}>
              <div className={s.bodysItem}>Cat1</div>
              <div className={s.bodysItem}>Cat2</div>
              <div className={s.bodysItem}>Cat3</div>
              <div className={s.bodysItem}>Cat4</div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={s.itemOrange}>
            <Accordion.Header>
              <FaCat />
              Title3
            </Accordion.Header>
            <Accordion.Body className={s.itemBody}>
              <div className={s.bodysItem}>Cat1</div>
              <div className={s.bodysItem}>Cat2</div>
              <div className={s.bodysItem}>Cat3</div>
              <div className={s.bodysItem}>Cat4</div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={s.itemGreen}>
            <Accordion.Header>
              <FaCat />
              Title4
            </Accordion.Header>
            <Accordion.Body className={s.itemBody}>
              <div className={s.bodysItem}>Cat1</div>
              <div className={s.bodysItem}>Cat2</div>
              <div className={s.bodysItem}>Cat3</div>
              <div className={s.bodysItem}>Cat4</div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={s.itemBlue}>
            <Accordion.Header>
              <FaCat />
              Title5
            </Accordion.Header>
            <Accordion.Body className={s.itemBody}>
              <div className={s.bodysItem}>Cat1</div>
              <div className={s.bodysItem}>Cat2</div>
              <div className={s.bodysItem}>Cat3</div>
              <div className={s.bodysItem}>Cat4</div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={s.itemPink}>
            <Accordion.Header>
              <FaCat />
              Title6
            </Accordion.Header>
            <Accordion.Body className={s.itemBody}>
              <div className={s.bodysItem}>Cat1</div>
              <div className={s.bodysItem}>Cat2</div>
              <div className={s.bodysItem}>Cat3</div>
              <div className={s.bodysItem}>Cat4</div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={s.itemOrange}>
            <Accordion.Header>
              <FaCat />
              Title7
            </Accordion.Header>
            <Accordion.Body className={s.itemBody}>
              <div className={s.bodysItem}>Cat1</div>
              <div className={s.bodysItem}>Cat2</div>
              <div className={s.bodysItem}>Cat3</div>
              <div className={s.bodysItem}>Cat4</div>
            </Accordion.Body>
          </Accordion.Item>
          <div className={s.itemGrey} onClick={() => setMoveToRight(true)}>
            <h2>
              <button>
                <IoSettingsSharp />
                設定
              </button>
            </h2>
          </div>
        </Accordion>
      </div>
    </div>
  );
};
