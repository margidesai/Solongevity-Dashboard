import { HttpException, HttpStatus } from "@nestjs/common";

export const TypeExceptions = {
    UserNotFound(): any {
        return new HttpException({ message: "User not found", error: 'Not Found', statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
    },
    
    UserAlreadyExists(): any {
        return new HttpException({ message: "User already exists", error: 'UserAlreadyExists', statusCode: HttpStatus.CONFLICT }, HttpStatus.CONFLICT);
    },

    InvalidFile(): any {
        return new HttpException({ message: "Uploaded file is invalid", error: 'InvalidFile', statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    },
}