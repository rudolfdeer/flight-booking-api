import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from '../admin.guard';

describe('admin guard', () => {
  let adminGuard: AdminGuard;

  beforeEach(() => {
    adminGuard = new AdminGuard();
  });

  it('should be defined', () => {
    expect(adminGuard).toBeDefined();
  });

  describe('can activate', () => {
    it('should return true when user is authenticated', () => {
      const mockContext = createMock<ExecutionContext>();
      mockContext.switchToHttp().getRequest.mockReturnValue({
        user: {
          id: 1,
          isAdmin: true,
        },
      });
      const canActivate = adminGuard.canActivate(mockContext);

      expect(canActivate).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      const mockContext = createMock<ExecutionContext>();
      mockContext.switchToHttp().getRequest.mockReturnValue({
        user: {
          id: 1,
          isAdmin: false,
        },
      });
      const canActivate = adminGuard.canActivate(mockContext);

      expect(canActivate).toBe(false);
    });
  });
});
