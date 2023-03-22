import { Controller, Get,Post,Request,Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { pharmacyNetworkDto } from './dto/pharmacyNetwork.dto';
import { PharmacyNetworkService } from './pharmacyNetwork.service';

@Controller('pharmacy-network')
@ApiTags('PharmacyNetwok')
export class PharmacyNetworkController {
  constructor(private pharmacynetworkService: PharmacyNetworkService) {}

  @Post('addPharmacyNetwork')
  async addPharmacyNetwork(@Body() params: pharmacyNetworkDto){
    const addPharamacyNetwork = await this.pharmacynetworkService.addPharamacyNetwork(params)
    return addPharamacyNetwork
  }

  @Get('getProductPlanDetails')
  async getProductPlanDetails(@Request() req: Request) {
    const getProductPlan = await this.pharmacynetworkService.getProductPlan(
      req.headers['authorization'],
    );
    return getProductPlan;
  }

  
}
