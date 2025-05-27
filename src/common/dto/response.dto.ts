import { HttpStatus } from "@nestjs/common";
import { Expose, Type } from "class-transformer";

export class APIResponse<T>{
   

   

   @Expose()
   @Type(()=> Object)
   data: T | unknown;

   @Expose()
   message:string| undefined;

   @Expose()
   error: boolean | undefined;

   @Expose()
   statusCode: number;

   @Expose()
   timestamp:string;

   constructor(
    partial: Partial<APIResponse<T>>,
    statusCode: number = HttpStatus.OK
   ){
    this.statusCode = statusCode;
    this.error = partial.error;
    this.timestamp = new Date().toISOString();
    this.message = partial.message;
    this.data = partial.data
   }

   static success<T>(data:T, message = "Success", statusCode = HttpStatus.OK): APIResponse<T>{
    return new APIResponse({
        data,
        message,
        error: false,

    },statusCode);
   }

   static found<T>(data:T, message = "Found"): APIResponse<T>{
    return new APIResponse({
        data,
        message,
        error: false,

    },HttpStatus.FOUND);
   }



   static created<T>(data: T, message = 'User created'): APIResponse<T> {
    return new APIResponse(
      {
        data,
        message,
        error: false,
      },
      HttpStatus.CREATED
    );
  }

  static update<T>(data: T, message = "Update Successful"): APIResponse<T>{
    return new APIResponse({
        data,
        message,
        error: false
    }, HttpStatus.ACCEPTED);
  }

  static delte<T> (data: T, message = "Delete Successful"):APIResponse<T>{
    return new APIResponse({
        data,
        message,
        error: false
    }, HttpStatus.OK);
  }

  static error(
    message: string,
    statusCode = HttpStatus.BAD_REQUEST
  ): APIResponse<null> {
    return new APIResponse(
      {
        data: null,
        message,
        error: true,
      },
      statusCode
    );
  }


}