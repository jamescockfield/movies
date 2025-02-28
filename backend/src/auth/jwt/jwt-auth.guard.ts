import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    private excludedRoutes: string[] = ['/auth/login', '/auth/register'];

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { url } = request;

        if (this.excludedRoutes.includes(url)) {
            return true; // Bypass the guard for these routes
        }

        return super.canActivate(context);
    }
}