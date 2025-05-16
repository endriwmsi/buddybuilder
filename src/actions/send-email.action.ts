"use server";

import transporter from "@/lib/nodemailer";

const styles = {
  container:
    "500px;margin:20px auto;padding: 20px;border:1px solid #000;border-radius: 6px;",
  header: "font-size:20px;color:#333;",
  paragraph: "font-size:16px;",
  link: "display:inline-block;margin-top:15px;padding:10px 15px:background:#007BFF;color:#fff;text-decoration:none;border-radius: 4px;",
};

export async function sendEmailAction({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: {
    description: string;
    link: string;
  };
}) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `BuilderBuddy - ${subject}`,
    html: `
      <div style="${styles.container}">
        <h1 style="${styles.header}">${subject}</h1>

        <p style="${styles.paragraph}">${meta.description}</p>

        <a href="${meta.link}" style="${styles.link}">Clique Aqui</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("sendEmailAction error", error);
    return { success: false };
  }
}
