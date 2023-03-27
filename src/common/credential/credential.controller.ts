import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CredentialService } from './credential.service';
import { credentialDto } from './dto/credential.dto';

@Controller('credential')
@ApiTags('Credential')
export class CredentialController {
      constructor(private credentialService:CredentialService ) {}

      @Post('changeCredential')
      async changeCredential(@Body() body:credentialDto) {
        const changeCredential = await this.credentialService.changeCredential(body);
        return changeCredential;
      }
}
