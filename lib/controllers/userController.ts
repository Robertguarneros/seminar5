import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUser } from '../modules/users/model';
import UserService from '../modules/users/service';
import e = require('express');

export class UserController {

    private user_service: UserService = new UserService();

    public async create_user(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the erquest or not
            if (req.body.name && req.body.name.first_name && req.body.name.middle_name && req.body.name.last_name &&
                req.body.email &&
                req.body.phone_number &&
                req.body.gender) {
                const user_params: IUser = {
                    name: {
                        first_name: req.body.name.first_name,
                        middle_name: req.body.name.middle_name,
                        last_name: req.body.name.last_name
                    },
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    gender: req.body.gender,
                    modification_notes: [{
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'New user created'
                    }]
                };
                const user_data = await this.user_service.createUser(user_params);
                successResponse('create user successful', user_data, res);
            } else {
                // error response if some fields are missing in request body
                insufficientParameters(res);
            }
        }catch(error){
            mongoError(error,res);
        }
    }

    public async get_user(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const user_filter = { _id: req.params.id };
                // Fetch user
                const user_data = await this.user_service.filterUser(user_filter);
                // Send success response
                successResponse('get user successful', user_data, res);
            } else {
                insufficientParameters(res);
            }
        }catch(error){
            mongoError(error, res);
        }
    }

    public async update_user(req: Request, res: Response) {
        try {
            if (req.params.id &&
                (req.body.name || req.body.name.first_name || req.body.name.middle_name || req.body.name.last_name ||
                    req.body.email ||
                    req.body.phone_number ||
                    req.body.gender)) {
                const user_filter = { _id: req.params.id };
                // Fetch user
                const user_data = await this.user_service.filterUser(user_filter);
                if (!user_data) {
                    // Send failure response if user not found
                    failureResponse('invalid user', null, res);
                    return;
                }

                // Update user data
                user_data.modification_notes.push({
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'User data updated'
                });

                const user_params: IUser = {
                    _id: req.params.id,
                    name: req.body.name ? {
                        first_name: req.body.name.first_name ? req.body.name.first_name : user_data.name.first_name,
                        middle_name: req.body.name.middle_name ? req.body.name.middle_name : user_data.name.middle_name,
                        last_name: req.body.name.last_name ? req.body.name.last_name : user_data.name.last_name
                    } : user_data.name,
                    email: req.body.email ? req.body.email : user_data.email,
                    phone_number: req.body.phone_number ? req.body.phone_number : user_data.phone_number,
                    gender: req.body.gender ? req.body.gender : user_data.gender,
                    is_deleted: req.body.is_deleted ? req.body.is_deleted : user_data.is_deleted,
                    modification_notes: user_data.modification_notes
                };
                // Update user
                await this.user_service.updateUser(user_params);
                // Send success response
                successResponse('update user successful', null, res);
            } else {
                // Send error response if ID parameter or any required fields are missing
                insufficientParameters(res);
            }
        } catch (error) {
            // Catch and handle any errors
            mongoError(error, res);
        }
    }

    public async delete_user(req: Request, res: Response) {
        try {
            if (req.params.id) {
                // Delete user
                const delete_details = await this.user_service.deleteUser(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    successResponse('delete user successful', null, res);
                } else {
                    // Send failure response if user not found
                    failureResponse('invalid user', null, res);
                }
            } else {
                // Send error response if ID parameter is missing
                insufficientParameters(res);
            }
        } catch (error) {
            // Catch and handle any errors
            mongoError(error, res);
        }
    }
}