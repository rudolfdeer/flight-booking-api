import { Controller, Delete, Post, Put } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Post('/sign-up')
  signUp() {
    //
  }

  @Post('/sign-in')
  signIn() {
    //
  }

  @Delete('/sign-out')
  signOut() {
    //
  }

  @Put('/update')
  update() {
    //
  }

  @Delete('/delete')
  delete() {
    //
  }
}
