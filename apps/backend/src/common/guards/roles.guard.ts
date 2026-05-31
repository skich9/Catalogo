import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    const roleHierarchy = {
      [UserRole.SUPER_ADMIN]: 3,
      [UserRole.ADMIN]: 2,
      [UserRole.EMPLOYEE]: 1,
    };
    const userLevel = roleHierarchy[user.role] || 0;
    return requiredRoles.some((role) => userLevel >= roleHierarchy[role]);
  }
}
