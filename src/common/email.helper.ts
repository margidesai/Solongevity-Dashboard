import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Model } from 'mongoose';

import * as smtpTransport from 'nodemailer-smtp-transport';
/**
 * Email Helper is used for sending emails
 */
@Injectable()
export class EmailHelper {
  constructor() {}

  public async sendMailToAdmin(
    admin: any,
    subject: any = null,
  ): Promise<nodemailer.SentMessageInfo> {
    const appName = process.env.APP_NAME;

    try {
      const mailHeader = `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http - equiv="Content-Type" />
      <title>Email Template </title><meta name="description" content="Email Template.">
      <style type="text/css">a:hover {text-decoration: underline !important;}
      </style></head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp; </td></tr><tr><td style="text-align:center;"></td></tr><tr><td style="height:20px;">&nbsp; </td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp; </td></tr>`;

      const mailFooter = `<tr><td style="height:40px;">&nbsp; </td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body></html>`;

      const Data = {
        appName,
        adminname: admin.userName || admin.email,
        PasswordLink: admin.token,
      };

      const mailSubject = subject ? subject : `${appName}`;

      return await this.emailsender(
        admin.email,
        mailSubject,
        mailHeader + admin.html + mailFooter,
        Data,
      );
      // }
    } catch (e) {
      console.log('sendMailToAdmin::::::::::::::::::::::::::', e);
      console.log(e);
    }
  }

  public async emailsender(
    email: string,
    subject: string,
    mailbody: string,
    data: object,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      const transport = nodemailer.createTransport(
        smtpTransport({
          host: 'smtp.1and1.com',
          secureConnection: false, // use SSL
          port: 587,
          auth: {
            user: 'margi.desai@agileinfoways.com',
            pass: 'JayAmbe@121198',
          },
        }),
      );
      const mailOption: Mail.Options = {
        from: 'margi.desai@agileinfoways.com',
        to: email,
        subject,
        html: mailbody,
        text: JSON.stringify(data),
      };

      return await transport.sendMail(mailOption);
    } catch (e) {
      
      throw new InternalServerErrorException('Internal Server error');
    }
  }
}
