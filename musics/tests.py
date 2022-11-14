# from django.test import TestCase

# Create your tests here.

def endpoint(function):
    def inner(*args, **kwargs):
        return function(*args, **kwargs)
    return function

@endpoint
def sessions(event_id):
    """Returns the session ids for the event."""
    return [1, 2, 3]


@endpoint
def events():
    """Returns the events to which you have access"""
    return [2717]


if __name__ == "__main__":
    event_id = events()[0]
    print(sessions(event_id))