import { SENDER_EMAIL } from '@/lib/consts/consts';
import path from 'path';
import { Resend } from 'resend';
import fs from 'fs/promises';

interface ISendEmailResponse {
  success: boolean;
  error?: string;
};

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend("re_anRQ25D3_AzdPE4ftX5FeHJeP36QkwcMv");

export async function sendChangeEmailCode(
  email: string,
  code: string
): Promise<ISendEmailResponse> {
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'sendChangeEmailCodeTemplate.html');

  let htmlContent = await fs.readFile(templatePath, 'utf-8');

  htmlContent = htmlContent.replace('{{CODE}}', code);

  const { error } = await resend.emails.send({
    from: SENDER_EMAIL,
    to: [`${email}`],
    subject: '"Мой Дворецкий"-код для смены email',
    html: htmlContent,
  });

  if (error) {
    return { success: false };
  };

  return { success: true };
};
