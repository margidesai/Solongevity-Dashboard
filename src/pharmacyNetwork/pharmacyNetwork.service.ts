import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Login, LoginDocument } from 'schemas/login.schema';
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
import { customProductPlanDto } from './dto/customProductPlanDto.dto';
import { updatePharmacyNetworkDto } from './dto/updatePharmacyNetwork.dto';
import { deletePharmacyNetworkDto } from './dto/deletePharmacyNetwork.dto';

@Injectable()
export class PharmacyNetworkService {
  constructor(
    @InjectModel(ProductPlan.name)
    private productPlanmodel: Model<ProductPlanDocument>,
    @InjectModel(PharmacyNetwork.name)
    private pharmacyNetworkmodel: Model<PharmacyNetworkDocument>,
    @InjectModel(Login.name)
    private loginmodel: Model<LoginDocument>,
    private readonly mailer: EmailHelper,
  ) {}

  async getProductPlan(authHeaders: string) {
    const getProductPlan = await this.productPlanmodel.find({
      isActive: true,
      isCustomPlan: false,
    });
    return getProductPlan;
  }

  async addPharamacyNetwork(params) {
    try {
      // let data = JSON.parse(params.productPlan);
      // console.log("data is:::::::::::::::::::::::::",data);
      let checkEmail = await this.loginmodel.find({
        email: params.email,
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
                            <h3>Email: ${params.email}</h3>  
                            <h3>Passowrd: ${randomPassword}</h3>  
                          </td>
                        </tr>`;

        let loginInfo = {
          email: params.email,
          password: passwordHash,
          userType: params.userType,
        };
        let total;

        let storeProductPlan = params.productPlan;
        JSON.parse(JSON.stringify(storeProductPlan)).map((sp) => {
          sp.amount += sp.amount;
          total = sp.amount;
        });
        let discount = parseInt(params.vat) / 100;
        let finalAmount = total - total * discount;
        let pharmacyData = {
          name: params.name,
          personName: params.personName,
          loginId: '',
          address: params.address,
          town: params.town,
          postalCode: params.postalCode,
          country: params.country,
          phoneNumber: params.phoneNumber,
          personOfReference: params.personOfReference,
          vat: params.vat,
          galaxy: params.galaxy,
          productPlan: storeProductPlan,
          total: total,
          finalAmount: finalAmount,
          contractFile: params.contractFile,
          paymentMode: params.paymentMode,
          hqClient: params.hqClient,
          agentClient: params.agentClient,
        };
        if (loginInfo && pharmacyData) {
          let addLoginInfo = await this.loginmodel.create(loginInfo);
          if (addLoginInfo) {
            pharmacyData.loginId = addLoginInfo._id;
            await this.pharmacyNetworkmodel.create(pharmacyData);
            await this.mailer.sendMailToAdmin(
              {
                adminName: params.name,
                email: params.email,
                html: mailBody,
              },
              'Pharmacy Network Info',
            );
            return { ...loginInfo, ...pharmacyData };
          } else {
            throw CustomError.UnknownError(
              'Something went wrong, please try again later!',
            );
          }
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

  //add Custom Product Plan
  async addCustomProductPlan(customProductPlanDto: customProductPlanDto) {
    const addCustomProductPlan = await this.productPlanmodel.create(
      customProductPlanDto,
    );
    if (addCustomProductPlan) {
      await this.productPlanmodel.updateOne(
        { _id: addCustomProductPlan._id },
        { isShown: true },
      );
      return addCustomProductPlan;
    }
    console.log(
      'custom plan dto:::::::::::::::::::::::::',
      addCustomProductPlan,
    );
  }

  //List Pharmacy Network
  async getAllPharmacyNetwork(body: any): Promise<any> {
    try {
      const limit = body.limit ? Number(body.limit) : 10;
      const page = body.page ? Number(body.page) : 1;
      const skip = (page - 1) * limit;
      console.log('body is::::::::::::::::', body);
      let start_date, end_date;

      if (body.dateRange == 'today') {
        start_date = new Date(new Date().setUTCHours(0, 0, 0, 0));
        end_date = new Date(new Date().setUTCHours(11, 59, 59, 999));
      }
      if (body.dateRange == 'thisWeek') {
        start_date = new Date(new Date().setUTCHours(0, 0, 0, 0));
        let day = new Date(new Date().setUTCHours(0, 0, 0, 0));
        day.setDate(day.getDate() + 7);
        end_date = day;
      }
      if (body.dateRange == 'lastWeek') {
        let day = new Date(new Date().setUTCHours(0, 0, 0, 0));
        day.setDate(day.getDate() - 7);
        start_date = day;
        end_date = new Date(new Date().setUTCHours(0, 0, 0, 0));
      }
      if (body.dateRange == 'custom') {
        start_date = new Date(body.startDate);
        let day = new Date(body.endDate);
        day.setDate(day.getDate() + 1);
        end_date = day;
        console.log(
          'start date and end date is:::::::::::::::',
          start_date,
          end_date,
        );
      }
      const aggregateQuery = [];

      aggregateQuery.push({
        $match: {
          createdAt: {
            $gte: start_date,
            $lt: end_date,
          },
        },
      });

      aggregateQuery.push({
        $lookup: {
          from: 'tbl_login',
          localField: 'loginId',
          foreignField: '_id',
          as: 'loginDetails',
        },
      });

      aggregateQuery.push({
        $unwind: {
          path: '$loginDetails',
          preserveNullAndEmptyArrays: true,
        },
      });
      aggregateQuery.push({
        $group: {
          _id: '$_id',
          loginId: {
            $first: '$loginId',
          },
          name: {
            $first: '$name',
          },
          email: {
            $first: '$loginDetails.email',
          },
          location: {
            $first: '$address',
          },
          galaxy: {
            $first: '$galaxy',
          },
          productPlan: {
            $first: '$productPlan',
          },
        },
      });
      aggregateQuery.push({
        $project: {
          _id: 1,
          loginId: 1,
          name: 1,
          email: 1,
          location: 1,
          galaxy: 1,
          productPlan: {
            $size: '$productPlan',
          },
        },
      });

      if (body.search) {
        const searchText = body.search.trim();
        const regex = new RegExp(searchText, 'i');
        aggregateQuery.push({
          $match: {
            $or: [
              {
                name: {
                  $regex: regex,
                },
              },
              {
                email: {
                  $regex: regex,
                },
              },
              {
                address: {
                  $regex: regex,
                },
              },
              {
                galaxy: {
                  $regex: regex,
                },
              },
            ],
          },
        });
      }

      const sort = {
        [body.column || 'createdAt']: body.order == 'asc' ? 1 : -1,
      };
      aggregateQuery.push({
        $sort: sort,
      });

      aggregateQuery.push({
        $facet: {
          listPharmacyNetwork: [{ $skip: skip }, { $limit: limit }],
          total_records: [{ $count: 'count' }],
        },
      });

      const listPharmacyNetwork = await this.pharmacyNetworkmodel
        .aggregate(aggregateQuery)
        .exec();

      if (listPharmacyNetwork) {
        listPharmacyNetwork[0].total_records =
          listPharmacyNetwork[0].total_records.length > 0
            ? listPharmacyNetwork[0].total_records[0].count
            : 0;
      }
      return listPharmacyNetwork[0];
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw CustomError.UnknownError(
          error?.message || 'Something went wrong, please try again later!',
        );
      }
    }
  }

  //get Pharmacy Details
  async getPharmacyNetworkDetails(body: any): Promise<any> {
    try {
      console.log('id is::::::::::::', body);
      const aggregateQuery = [];
      aggregateQuery.push({
        $match: {
          _id: new mongoose.Types.ObjectId(body.pharmacyNetworkId),
        },
      });
      aggregateQuery.push({
        $lookup: {
          from: 'tbl_login',
          localField: 'loginId',
          foreignField: '_id',
          as: 'loginDetails',
        },
      });

      aggregateQuery.push({
        $unwind: {
          path: '$loginDetails',
          preserveNullAndEmptyArrays: true,
        },
      });
      aggregateQuery.push({
        $unwind: {
          path: '$productPlan',
          preserveNullAndEmptyArrays: true,
        },
      });
      aggregateQuery.push({
        $addFields: {
          productPlanOId: {
            $toObjectId: '$productPlan.productPlanId',
          },
        },
      });
      aggregateQuery.push({
        $lookup: {
          from: 'tbl_productPlan',
          localField: 'productPlanOId',
          foreignField: '_id',
          as: 'productPlanDetails',
        },
      });

      aggregateQuery.push({
        $unwind: {
          path: '$productPlanDetails',
          preserveNullAndEmptyArrays: true,
        },
      });
      aggregateQuery.push({
        $group: {
          _id: '$_id',
          name: {
            $first: '$name',
          },
          personName: {
            $first: '$personName',
          },
          email: {
            $first: '$loginDetails.email',
          },
          phoneNumber: {
            $first: '$phoneNumber',
          },
          location: {
            $first: '$address',
          },
          galaxy: {
            $first: '$galaxy',
          },
          personOfReference: {
            $first: '$personOfReference',
          },
          vat: {
            $first: '$vat',
          },
          paymentMode: {
            $first: '$paymentMode',
          },
          hqClient: {
            $first: '$hqClient',
          },
          agentClient: {
            $first: '$agentClient',
          },
          contractFile: {
            $first: '$contractFile',
          },
          productPlanDetails: {
            $push: '$productPlanDetails',
          },
        },
      });
      const listPharmacyNetwork = await this.pharmacyNetworkmodel
        .aggregate(aggregateQuery)
        .exec();
      return listPharmacyNetwork;
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw CustomError.UnknownError(
          error?.message || 'Something went wrong, please try again later!',
        );
      }
    }
  }

  //Active Inactive Pharmacy Network
  async activeInactivePharmacyNetwork(body: any): Promise<any> {
    try {
      console.log('body is:::::::::::::::', body);
      let getPharmacyNetwork = await this.pharmacyNetworkmodel.findOne({
        _id: body.pharmacyNetworkId,
      });
      if (!getPharmacyNetwork) {
        throw CustomError.NotFound('Pharmacy network not found');
      } else {
        const activeInactive = await this.pharmacyNetworkmodel.findOneAndUpdate(
          { _id: body.pharmacyNetworkId },
          { isActive: getPharmacyNetwork.isActive === true ? false : true },
          { new: true },
        );
        return activeInactive;
      }
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw CustomError.UnknownError(
          error?.message || 'Something went wrong, please try again later!',
        );
      }
    }
  }

  //Update Pharmacy Network
  async updatePharmacyNetwork(body: updatePharmacyNetworkDto): Promise<any> {
    try {
      const getPharmacyNetwork = await this.pharmacyNetworkmodel.findOne({
        _id: body.pharmacyNetworkId,
      });
      if (!getPharmacyNetwork) {
        throw CustomError.NotFound('Pharmacy network not found');
      } else {
        const updateObj = {
          ...body,
          isActive: true,
          updatedAt: new Date().toISOString(),
        };

        const updatePharmacyNetwork =
          await this.pharmacyNetworkmodel.findByIdAndUpdate(
            { _id: body.pharmacyNetworkId },
            updateObj,
            { new: true },
          );
        const updateData = {
          name: updatePharmacyNetwork.name,
          personName: updatePharmacyNetwork.personName,
          address: updatePharmacyNetwork.address,
          town: updatePharmacyNetwork.town,
          postalCode: updatePharmacyNetwork.postalCode,
          country: updatePharmacyNetwork.country,
          phoneNumber: updatePharmacyNetwork.phoneNumber,
          personOfReference: updatePharmacyNetwork.personOfReference,
          vat: updatePharmacyNetwork.vat,
        };
        return updateData;
      }
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw CustomError.UnknownError(
          error?.message || 'Something went wrong, please try again later!',
        );
      }
    }
  }

  //Delete Pharmacy Network
  async deletePharmacyNetwork(body: deletePharmacyNetworkDto): Promise<any> {
    body.pharmacyNetworkId.map(async (pharamacyNId) => {
      try {
        await this.pharmacyNetworkmodel.findOneAndUpdate(
          { _id: pharamacyNId },
          { isDeleted: true },
          { new: true },
        );
        return {
          message: 'Deleted pharmacy network successfully.',
        };
      } catch (error) {
        if (error) {
          throw error;
        } else {
          throw CustomError.UnknownError(
            error?.message || 'Something went wrong, please try again later!',
          );
        }
      }
    });
  }

  //Update Management Info
  async updateManagementInfo(body): Promise<any> {
    try {
      let getPhramacyNetworkId = await this.pharmacyNetworkmodel.findOne({
        _id: body.pharmacyNetworkId,
      });
      if (!getPhramacyNetworkId) {
        throw CustomError.NotFound('Pharmacy network not found');
      } else {
        let updatedManagementInfo =
          await this.pharmacyNetworkmodel.findOneAndUpdate(
            { _id: body.pharmacyNetworkId },
            {
              hqClient: body.hqClient,
              agentClient: body.agentClient,
            },
            { new: true },
          );
        return { _id: updatedManagementInfo._id,hqClient:updatedManagementInfo.hqClient,agentClient:updatedManagementInfo.agentClient };
      }
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw CustomError.UnknownError(
          error?.message || 'Something went wrong, please try again later!',
        );
      }
    }
  }
}
