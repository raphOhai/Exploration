import { Controller, Post, Body, Request, UseGuards, Headers, Param } from '@nestjs/common';
import { StrigaService } from './striga.service';
import * as StrigaTypes from './striga.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('card')
@UseGuards(JwtAuthGuard)
export class StrigaController {
    constructor(private readonly strigaService: StrigaService) { }

    @Post('apply-for-card')
    async applyForAccount(
        @Body() data: Partial<StrigaTypes.AccountApplicationData>,
        @Request() req,
        @Headers('authorization') authHeader?: string,
    ) {
        // Option 1: Extract token from Authorization header
        const token = authHeader?.replace('Bearer ', '') || '';

        // Option 2: Extract token from request headers directly
        // const token = req.headers.authorization?.replace('Bearer ', '') || '';

        // Option 3: Get the authenticated user (already validated by JwtAuthGuard)
        const user = req.user;
        console.log(user, "user---------------------");

        return this.strigaService.initialAccountCreation(data, user);
    }

    @Post('apply-for-card-step2')
    async applyForCardStep2(
        @Body() data: Partial<StrigaTypes.StrigaAccountCreationStep2Data>,
        @Request() req,
        @Headers('authorization') authHeader?: string,
    ) {
        const user = req.user;
        return this.strigaService.acountCreationStep2(data, user);
    }
}





