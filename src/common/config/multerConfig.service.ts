
import { Injectable } from '@nestjs/common';
import type { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { log } from 'console';
import * as fs from "fs";
import { diskStorage } from 'multer';
import * as path from "path";


@Injectable()
export class MulterConfigService implements MulterOptionsFactory {

    createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
        const uploadDir = path.resolve(__dirname, '..', '..', 'Uploads');

        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log(`Created upload directory: ${uploadDir}`);
            }
        } catch (error) {
            console.error(`Failed to create upload directory: ${error.message}`);
            throw new Error(`Cannot create upload directory: ${uploadDir}`);
        }
        return {
            storage: diskStorage({

                destination: (req, file, cb) => {
                    console.log(`Saving file to: ${uploadDir}`);
                    cb(null, uploadDir);
                },
                
                filename: (req, file, cd) => {
                    log(`Processing file: ${file.originalname}`);
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

                    const ext = path.extname(file.originalname);
                    cd(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
                }
            }),
            limits: {
                fieldSize: 5 * 1024 * 1024
            },
            fileFilter(req, file, callback){
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    req.fileValidationError = 'Only image files are allowed!';
                    return callback(new Error('Only image files are allowed!'), false, );
                }
                callback(null, true);
            }
        }
    }
}
