import { Resend } from 'resend';
import { SENDER_EMAIL, SUPPORT_EMAIL } from '@/lib/consts/consts';
import path from 'path';
import fs from 'fs/promises';

interface ISendEmailResponse {
  success: boolean;
  error?: string;
};

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend("re_anRQ25D3_AzdPE4ftX5FeHJeP36QkwcMv");

export async function sendSupportMsg(
  email: string,
  userName: string,
  message: string,
  theme: string,
): Promise<ISendEmailResponse> {

  const templatePath = path.join(process.cwd(), 'public', 'templates', 'supportMessageTemplate.html');

  let htmlContent = await fs.readFile(templatePath, 'utf-8');
  const themeForEmail = theme ? theme : 'Нужна помощь с авторизацией';

  htmlContent = htmlContent.replace('{{THEME}}', themeForEmail);
  htmlContent = htmlContent.replace('{{USER_NAME}}', userName);
  htmlContent = htmlContent.replace('{{EMAIL}}', email);
  htmlContent = htmlContent.replace('{{MESSAGE}}', message);

  const { error } = await resend.emails.send({
    from: SENDER_EMAIL,
    to: [`${SUPPORT_EMAIL}`],
    subject: themeForEmail,
    html: htmlContent,
  });

  if (error) {
    return { success: false };
  };

  return { success: true };
};
