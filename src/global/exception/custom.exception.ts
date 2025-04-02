import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCodeException extends HttpException {
  constructor() {
    super('인증 코드가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
  }
}
export class InvalidCodeExpiredException extends HttpException {
  constructor() {
    super(
      '인증 코드가 만료되었거나 이메일 인증이 필요합니다.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);
  }
}
export class TokenExpiredException extends HttpException {
  constructor() {
    super('토큰이 만료되었습니다.', HttpStatus.UNAUTHORIZED);
  }
}
export class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super('유효하지 않은 refresh token입니다.', HttpStatus.UNAUTHORIZED);
  }
}
