import { TextField } from "@/components/TextField";
import { textsConfig } from "./texts";

import styles from './GiftContentLifeHacks.module.css';

export const GiftContentLifeHacks = () => {
  const { lifeHacksContent, lifeHacksBonus } = textsConfig;

  return (
    <div className={styles.container}>
      <TextField variant="h2" color="title" style={{ marginBottom: '20px' }}>
        Лайфхаки профессиональных поваров
      </TextField>
      <ul>
        {
          lifeHacksContent.map(elem => (
            <li key={elem.title}>
              <TextField variant="h3" color="main" style={{ marginBottom: '10px' }}>
                {elem.title}
              </TextField>
              <TextField variant="p" color="main" style={{ marginBottom: '10px' }}>
                {elem.paragraph}
              </TextField>
            </li>
          ))
        }
      </ul>
      <TextField variant="h3" color="error" style={{ margin: '20px 0' }}>
        Бонус:
      </TextField>
      <ul>
        {
          lifeHacksBonus.map(elem => (
            <li key={elem.title}>
              <TextField variant="p" color="main" style={{ marginBottom: '10px' }}>
                {elem.title}
              </TextField>
            </li>
          ))
        }
      </ul>
    </div>
  )
};