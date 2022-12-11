from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib import messages  
from django.middleware.csrf import CsrfViewMiddleware

# -------------------------------------------------

# @decorator(params)
# def func_name():
#     ''' Function implementation'''

# -------------------------------------------------

# def func_name():
#     ''' Function implementation'''

# func_name = decorator(params)(func_name)

# -------------------------------------------------


def logged_not_allowed(why_message):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            if request.user.is_authenticated:
                #messages.info(request,why_message)
                return redirect('musics:home_page')
            else:
                return view_func(request, *args, **kwargs)
        return wrapper_func
    return decorator

def only_logged(why_message):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            if not request.user.is_authenticated:
                messages.info(request,why_message)
                return redirect(request.build_absolute_uri('musics:main'))
            else:
                return view_func(request, *args, **kwargs)
        return wrapper_func
    return decorator


def allowed_goups(allowed_roles=[]):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            group_list = None
            if request.user.groups.exists():
                group_list = request.user.groups.values_list('name',flat = True)
                group_list = list(group_list)
                for group in group_list:
                    if group in allowed_roles:
                        return view_func(request, *args, **kwargs)
            return HttpResponse('You are not authorized to view this page')
        return wrapper_func
    return decorator

def admin_only(view_func):
	def wrapper_function(request, *args, **kwargs):
		group = None
		if request.user.groups.exists():
			group = request.user.groups.all()[0].name

		if group == 'customer':
			return redirect('user-page')

		if group == 'admin':
			return view_func(request, *args, **kwargs)

	return wrapper_function

def dirrect_not_allowed(view_func):
    def wrapper_function(request, *args, **kwargs):
        try:
            if request.META['HTTP_REFERER']=="http://127.0.0.1:8000/":
                return view_func(request, *args, **kwargs)
            else:
                return redirect(request.build_absolute_uri('musics:main'))
        except:
            return redirect(request.build_absolute_uri('musics:main'))
    return wrapper_function