import { Injectable } from '@nestjs/common';
import { CustomError } from '../helper/exception';

@Injectable()
export class FileUploadService {

      async uploadFile(body): Promise<any> {
            
          try{
            console.log("body is::::::::::::::::",body);
            let res = {
              path:body.destination,
              fileName:body.filename
            }
            return res
          }catch (error) {
            if (error?.response?.error) {
              throw error;
            } else {
              throw CustomError.UnknownError(error?.message);
            }
          }
      }
}
