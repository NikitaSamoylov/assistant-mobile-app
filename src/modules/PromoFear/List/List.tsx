import { CheckIcon } from '../CheckIcon';
import { UnCheckIcon } from '../UnCheckIcon';
import styles from './List.module.css';

import { TextField } from "@/components/TextField";

type TProps = {
  config: string[];
  icon: 'check' | 'uncheck';
};

export const List = ({ config, icon }: TProps) => {
  return (
    <ul className={styles.list}>
      {
        config.map(elem => (
          <li key={elem} className={styles.listItem}>
            {
              icon === 'check' && (
                <CheckIcon />
              ) || (
                <UnCheckIcon />
              )
            }
            <TextField variant="p" color="main" style={{ fontSize: '1.9rem', transform: 'translateY(-5px)' }}>
              {elem}
            </TextField>
          </li>
        ))
      }
    </ul>
  )
};