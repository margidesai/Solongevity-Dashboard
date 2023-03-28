import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { pharmacyNetworkDto } from 'src/pharmacyNetwork/dto/pharmacyNetwork.dto';
import { imageFileFilter } from 'src/util/file-uploading.utils';
import { FileUploadService } from './file-upload.service';

@ApiTags('file Upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService:FileUploadService){}


  @Post('/uploadFile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        contractFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseInterceptors(
  //   FileInterceptor('contractFile', {
  //     dest: './uploads/contractFile/',
  //     fileFilter: imageFileFilter,
  //   }),
    
  // )
  @UseInterceptors(
    FileInterceptor('contractFile',{
      storage:diskStorage({
        destination:'./uploads/contractFile/',
        
        filename:(req,file,callback)=>{
          // const uniqueSuffix = Date.now() + "-"
          const filename = `${file.originalname}`
          callback(null,filename)
        },
        
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadFiles(
    @UploadedFile() contractFile: Express.Multer.File,
  ) {
    return await this.fileUploadService.uploadFile(contractFile)
   
  }
}


