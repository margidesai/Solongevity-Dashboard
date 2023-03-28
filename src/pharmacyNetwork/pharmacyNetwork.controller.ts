import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { customProductPlanDto } from './dto/customProductPlanDto.dto';
import { pharmacyNetworkDto } from './dto/pharmacyNetwork.dto';
import { PharmacyNetworkService } from './pharmacyNetwork.service';
import { diskStorage } from 'multer';
import { updatePharmacyNetworkDto } from './dto/updatePharmacyNetwork.dto';
import { CustomError } from 'src/common/helper/exception';
import { deletePharmacyNetworkDto } from './dto/deletePharmacyNetwork.dto';

@Controller('pharmacy-network')
@ApiTags('PharmacyNetwok')
export class PharmacyNetworkController {
  constructor(private pharmacynetworkService: PharmacyNetworkService) {}

  @Post('addPharmacyNetwork')
  // @UseInterceptors(
  //   FileInterceptor('contractFile', { dest: './uploads/contractFile/' }),
  // )
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Pharmacy Netwok',
    schema: {
      type: 'object',
      properties: {
        userType: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        personName: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
        town: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        phoneNumber: {
          type: 'string',
        },
        personOfReference: {
          type: 'string',
        },
        vat: {
          type: 'string',
        },
        galaxy: {
          type: 'string',
        },
        productPlan: {
          type: 'string',
        },
        // contractFile: {
        //   type: 'string',
        //   format: 'binary',
        // },
        paymentMode: {
          type: 'string',
        },
        hqClient: {
          type: 'string',
        },
        agentClient: {
          type: 'string',
        },
      },
    },
  })
  async addPharmacyNetwork(
    // @UploadedFile() contractFile: Express.Multer.File,
    @Body() pharmacyNetworkDto: pharmacyNetworkDto,
  ) {
    // if (contractFile) {
    //   pharmacyNetworkDto.contractFile = contractFile.originalname;
    // }
    console.log("pharmacyNetworkDto:::::::::::::::::::::::",pharmacyNetworkDto);
    const addPharamacyNetwork =
      await this.pharmacynetworkService.addPharamacyNetwork(pharmacyNetworkDto);
    return addPharamacyNetwork;
  }

  @Get('getProductPlanDetails')
  async getProductPlanDetails(@Request() req: Request) {
    const getProductPlan = await this.pharmacynetworkService.getProductPlan(
      req.headers['authorization'],
    );
    return getProductPlan;
  }

  @Post('addCustomProductPlan')
  async addCustomProductPlan(@Body() params: customProductPlanDto) {
    console.log('params is:::::::::::::::', params);
    const addCustomProductPlan =
      await this.pharmacynetworkService.addCustomProductPlan(params);
    return addCustomProductPlan;
  }

  @Post('getAllPharmacyNetwork')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
        },
        limit: {
          type: 'number',
        },
        search: {
          type: 'string',
        },
        dateRange:{
          type:'string'
        },
        startDate:{
          type:'string'
        },
        endDate:{
          type:'string'
        }
      },
    },
  })
  async getAllPharmacyNetwork(@Body() body: any): Promise<any> {
    return this.pharmacynetworkService.getAllPharmacyNetwork(body);
  }

  @Post('/activeInactivePharmacyNetwork')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pharmacyNetworkId: {
          type: 'string',
        },
      },
    },
  })
  async activeInactive(@Body() body: any) {
    return this.pharmacynetworkService.activeInactivePharmacyNetwork(body);
  }

  @Post('updatePharmacyNetwork')
  async updateSubAdmin(@Body() body: updatePharmacyNetworkDto) {
    return this.pharmacynetworkService.updatePharmacyNetwork(body);
  }

  @Post('getPharmacyNetworkDetails')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pharmacyNetworkId: {
          type: 'string',
        },
      },
    },
  })
  async getPharmacyNetworkDetails(@Body() body: string) {
    const getPharmacyNetwork =
      await this.pharmacynetworkService.getPharmacyNetworkDetails(body);
    return getPharmacyNetwork
  }

  @Post('deletePharmacyNetwork')
  
  async deletePharmacyNetwork(@Body() body: deletePharmacyNetworkDto) {
    console.log("body is::::::::::::::",body);
    const getPharmacyNetwork =
      await this.pharmacynetworkService.deletePharmacyNetwork(body);
    return getPharmacyNetwork
  }


  @Post('updateManagementInfo')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pharmacyNetworkId: {
          type: 'string',
        },
        hqClient: {
          type: 'string',
        },
        agentClient:{
          type: 'string',
        }
      },
    },
  })
  async updateManagementInfo(@Body() body: any) {
    const getPharmacyNetwork =
      await this.pharmacynetworkService.updateManagementInfo(body);
    return getPharmacyNetwork
  }
}
