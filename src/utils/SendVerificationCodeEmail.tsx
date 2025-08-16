import { SENDER_EMAIL } from '@/lib/consts/consts';
import fs from 'fs/promises';
import path from 'path';
import { Resend } from 'resend';

interface ISendEmailResponse {
  success: boolean;
  error?: string;
};

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend("re_anRQ25D3_AzdPE4ftX5FeHJeP36QkwcMv");

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<ISendEmailResponse> {
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'sendCodeTemplate.html');

  let htmlContent = await fs.readFile(templatePath, 'utf-8');

  htmlContent = htmlContent.replace('{{CODE}}', code);

  const { error } = await resend.emails.send({
    from: SENDER_EMAIL,
    to: [`${email}`],
    subject: 'Мой дворецкий-код для входа',
    html: htmlContent,
  });

  if (error) {
    return { success: false };
  };

  return { success: true };
};
