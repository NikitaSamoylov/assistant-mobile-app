import { ReturnBtn } from "@/components/Buttons/ReturnBtn";
import { SectionWrapper } from "@/components/SectionWrapper";
import { TextField } from "@/components/TextField";
import { SupportForm } from "./SupportForm";
import styles from './Support.module.css';

export const Support = () => {
  return (
    <SectionWrapper>
      <main>
        <div className={styles.returnBtn}>
          <ReturnBtn />
        </div>
        <TextField
          variant="h1"
          color="main"
          style={{
            marginBottom: '25px',
            textAlign: 'center',
          }}
        >
          Поддержка
        </TextField>
        <div>
          <SupportForm />
        </div>
      </main>
    </SectionWrapper>
  )
};