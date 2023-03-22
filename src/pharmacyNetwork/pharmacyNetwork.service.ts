import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Login } from 'schemas/login.schema';
import { CustomError, TypeExceptions } from 'src/common/helper/exception';
import { AuthExceptions } from 'src/common/helper/exception/auth.exception';
import { randomString } from 'src/common/randomString';
import { pharmacyNetworkDto } from './dto/pharmacyNetwork.dto';
import {
  PharmacyNetwork,
  PharmacyNetworkDocument,
} from './schemas/pharmacyNetwork.schema';
import { ProductPlan, ProductPlanDocument } from './schemas/productPlan.schema';
import * as bcrypt from 'bcrypt';
import { EmailHelper } from 'src/common/email.helper';

@Injectable()
export class PharmacyNetworkService {
  constructor(
    @InjectModel(ProductPlan.name)
    private productPlanmodel: Model<ProductPlanDocument>,
    @InjectModel(PharmacyNetwork.name)
    private pharmacyNetworkmodel: Model<PharmacyNetworkDocument>,
    @InjectModel(Login.name)
    private loginmodel: Model<PharmacyNetworkDocument>,
    private readonly mailer: EmailHelper,
  ) {}

  async getProductPlan(authHeaders: string) {
    const getProductPlan = await this.productPlanmodel.find({});
    return getProductPlan;
  }

  async addPharamacyNetwork(pharmacyNetworkDto: pharmacyNetworkDto) {
    try {
      let checkEmail = await this.loginmodel.find({
        email: pharmacyNetworkDto.email,
      });
      if (checkEmail.length > 0) {
        throw TypeExceptions.EmailAlreadyExists();
      } else {
        let randomPassword = randomString.randomString(10, 'A');
        const saltOrRounds = 10;
        const passwordHash = await bcrypt.hash(randomPassword, saltOrRounds);

        const mailBody = `<tr>
                          <td style="padding:0 35px;">
                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Pharmacy Network Registration Info</h1>
                            <h3>Email: ${pharmacyNetworkDto.email}</h3>  
                            <h3>Passowrd: ${randomPassword}</h3>  
                          </td>
                        </tr>`;

        await this.mailer.sendMailToAdmin(
          {
            adminName: pharmacyNetworkDto.name,
            email: pharmacyNetworkDto.email,
            html: mailBody,
          },
          'Pharmacy Network Info',
        );

        let Info = {
          email: pharmacyNetworkDto.email,
          password: passwordHash,
          userType: pharmacyNetworkDto.userType,
        };
        let data = pharmacyNetworkDto.productPlanId
        console.log("data is::::::::::::::::::",data);
        let pharmacyData = {
          name: pharmacyNetworkDto.name,
          personName: pharmacyNetworkDto.personName,
          address: pharmacyNetworkDto.address,
          town: pharmacyNetworkDto.town,
          postalCode: pharmacyNetworkDto.postalCode,
          country: pharmacyNetworkDto.country,
          phoneNumber: pharmacyNetworkDto.phoneNumber,
          personOfReference: pharmacyNetworkDto.personOfReference,
          vat: pharmacyNetworkDto.vat,
          galaxy: pharmacyNetworkDto.galaxy,
        };
        if(Info && pharmacyData){
          await this.loginmodel.create(Info);
          await this.pharmacyNetworkmodel.create(pharmacyData);
          return {...Info,...pharmacyData}
        }else{
          throw new NotFoundException('Oops! Something went wrong.');
        }
        
      }
    } catch (error) {
      if (error?.response?.error) {
        throw error;
      } else {
        throw CustomError.UnknownError(error?.message);
      }
    }
  }
}
