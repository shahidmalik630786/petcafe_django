from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from functools import wraps

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