import { TextField } from "@/components/TextField";
import { textsConfig } from "./texts";
import styles from './GiftsContent.module.css';

export const GiftsContent = () => {
  const { contentKitchen, contentHouse, contentBonus } = textsConfig;

  return (
    <div className={styles.container}>
      <TextField variant="h2" color="title" style={{ marginBottom: '20px' }}>
        Где ошибаются 9 из 10 хозяек? И как это исправить
      </TextField>
      <TextField variant="h3" color="main" style={{ marginBottom: '20px' }}>
        #### 🍳 На кухне:
      </TextField>
      <ul>
        {
          contentKitchen.map(elem => (
            <li key={elem.title}>
              <TextField variant="h3" color="main" style={{ marginBottom: '10px' }}>
                {elem.title}
              </TextField>
              <TextField variant="p" color="error" style={{ marginBottom: '10px' }}>
                {elem.paragraph}
              </TextField>
              <TextField variant="p" color="main" style={{ marginBottom: '10px', color: '#419957' }}>
                {elem.todo}
              </TextField>
              <TextField variant="p" color="caption" style={{ marginBottom: '10px' }}>
                {elem.investigation}
              </TextField>
            </li>
          ))
        }
      </ul>
      <TextField variant="h3" color="main" style={{ margin: '20px 0' }}>
        #### 🧹 По дому:
      </TextField>
      <ul>
        {
          contentHouse.map(elem => (
            <li key={elem.title}>
              <TextField variant="h3" color="main" style={{ marginBottom: '10px' }}>
                {elem.title}
              </TextField>
              <TextField variant="p" color="error" style={{ marginBottom: '10px' }}>
                {elem.paragraph}
              </TextField>
              <TextField variant="p" color="main" style={{ marginBottom: '10px', color: '#419957' }}>
                {elem.todo}
              </TextField>
              <TextField variant="p" color="caption" style={{ marginBottom: '10px' }}>
                {elem.investigation}
              </TextField>
            </li>
          ))
        }
      </ul>
      <TextField variant="h3" color="title" style={{ margin: '20px 0' }}>
        ### 📌 Бонус: 3 «невидимые» ошибки
      </TextField>
      <ul>
        {
          contentBonus.map(elem => (
            <li key={elem.title}>
              <TextField variant="h3" color="main" style={{ marginBottom: '10px' }}>
                {elem.title}
              </TextField>
              <TextField variant="p" color="main" style={{ marginBottom: '10px', color: '#419957' }}>
                {elem.paragraph}
              </TextField>
            </li>
          ))
        }
      </ul>
    </div>
  )
};  