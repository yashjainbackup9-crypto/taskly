import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const user = process.env.BASE_SYSTEM_NODEMAILER_EMAIL_ADDRESS || 'info@thewebvale.com';
    const pass = process.env.BASE_SYSTEM_NODEMAILER_EMAIL_PASSWORD || 'Global5972@';

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
      });
      this.logger.log(`Nodemailer Transporter configured for ${user}`);
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    if (!this.transporter) return false;

    try {
      await this.transporter.sendMail({
        from: `"Taskly Workspace" <${process.env.BASE_SYSTEM_NODEMAILER_EMAIL_ADDRESS || 'info@thewebvale.com'}>`,
        to,
        subject: `Welcome to Taskly, ${name}! 🚀`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 16px; border: 1px solid #eaeaea;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0;">Welcome to Taskly</h1>
              <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Your modern collaborative task management workspace</p>
            </div>
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #f3f4f6;">
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                Hi <strong>${name}</strong>,<br/><br/>
                Your account is ready. You now have full access to Kanban Boards, Grouped Lists, Subtasks tracking, Real-Time Comments, and Custom Theme Palettes.
              </p>
            </div>
            <div style="text-align: center;">
              <a href="https://taskly.thewebvale.com" style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px;">Open Your Workspace ➔</a>
            </div>
            <div style="margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
              &copy; ${new Date().getFullYear()} Taskly Inc. AbleSpace Assessment.
            </div>
          </div>
        `,
      });
      this.logger.log(`Welcome email successfully sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.warn(`Failed to send welcome email to ${to}: ${error.message}`);
      return false;
    }
  }
}
