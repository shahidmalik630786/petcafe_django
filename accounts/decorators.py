from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from functools import wraps
import logging

logger = logging.getLogger('accounts')


def staff_active_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/accounts/login/') 
        
        if request.user.is_superuser:
            return view_func(request, *args, **kwargs)
        
        try:
            staff_profile = request.user.staff_profile.first()
            
            if staff_profile and staff_profile.is_active:
                return view_func(request, *args, **kwargs)
            else:
                raise PermissionDenied("Your staff account is not active.")
        
        except Exception as e:
            raise PermissionDenied("No staff profile found.")
    0
    return _wrapped_view


class StaffActiveRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            logger.warning(f"Unauthenticated user attempted to access {self.__class__.__name__}")
            return redirect('/accounts/login/')
        
        if request.user.is_superuser:
            logger.debug(f"Superuser {request.user.username} accessed {self.__class__.__name__}")
            return super().dispatch(request, *args, **kwargs)
        
        try:
            staff_profile = request.user.staff_profile.first()
            
            if staff_profile and staff_profile.is_active:
                logger.info(f"Active staff member {request.user.username} accessed {self.__class__.__name__}")
                return super().dispatch(request, *args, **kwargs)
            else:
                logger.warning(f"Inactive staff member {request.user.username} attempted to access {self.__class__.__name__}")
                raise PermissionDenied("Your staff account is not active.")
        
        except Exception as e:
            logger.error(f"Staff profile check failed for user {request.user.username}: {str(e)}")
            raise PermissionDenied("No staff profile found.")